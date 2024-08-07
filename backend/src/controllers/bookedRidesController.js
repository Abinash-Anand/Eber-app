const Booking = require('../models/rideBookings'); // Ensure the correct path to your model
const cron = require('node-cron'); // For scheduling tasks
const DriverModel = require('../models/driverVehiclePricingModel'); // Ensure the correct path to your model
const { find } = require('../models/vehicleTypeModel');
// Object to store timeouts for each booking
const bookingTimeouts = {};

// Function to handle ride booking
const rideBooked = async (req, res, io) => {
  try {
    const {
      EstimatedTime, bookingOption, driver, dropOffLocation, fromLocation,
      paymentOption, phone, pickupLocation, scheduleDateTime,
      selectedCard, serviceType, status, stopLocations, toLocation,
      totalDistance, userId, requestTimer, bookingId
    } = req.body;

    if (!EstimatedTime || !bookingOption || !driver || !dropOffLocation ||
        !fromLocation || !paymentOption || !phone || !pickupLocation || !scheduleDateTime
        || !selectedCard || !serviceType || !status || !toLocation || !totalDistance || !userId || !requestTimer || !bookingId) {
      return res.status(400).send({ Message: "Missing required fields" });
    }

    const newBooking = new Booking({
      EstimatedTime,
      bookingOption,
      city: driver.city._id,
      country: driver.country._id,
      driverObjectId: driver.driverObjectId._id,
      dropOffLocation,
      fromLocation,
      paymentOption,
      phone,
      pickupLocation,
      scheduleDateTime,
      selectedCard,
      serviceType,
      status,
      stopLocations,
      toLocation,
      totalDistance,
      userId,
      requestTimer,
      bookingId,
      vehicleImageURL: driver.vehicleImageURL,
      vehicleName: driver.vehicleName,
      vehicleType: driver.vehicleType
    });

    console.log("New Booking Object: ", newBooking);

    await newBooking.save();
    io.emit('rideDriverConfirmed', newBooking); // 'rideDriverConfirmed' is the event name, newBooking is the data sent with the event

    // Start the timer for request expiration
    scheduleRequestTimeout(newBooking._id, requestTimer, io);

    res.status(201).send({ Message: "New Booking Created", newBooking });
  } catch (error) {
    console.error("Error in rideBooked: ", error);
    res.status(500).send({ Message: "Internal Server Error", error });
  }
};

// Function to find another available driver
const findAnotherDriver = async (driverObjectId, vehicleType) => {
    try {
      const populateDriverObjectId =  await Booking.find(driverObjectId).populate('driverObjectId').lean()
      const availableDriver = await DriverModel.findOne({
          _id: { $ne: driverObjectId },
          city: populateDriverObjectId.city,
          vehicleType: vehicleType,
          status: 'approved',
      }).populate('driverObjectId').lean();
            console.log(`-------------| Driver Found ${availableDriver } |-----------`);

    return availableDriver;
  } catch (error) {
    console.error('Error finding another driver:', error);
    return null;
  }
};

// Function to get all accepted rides
const getAllAcceptedRides = async (req, res) => {
  try {
    const acceptedRides = await Booking.find({ status: 'Assigned' }).populate('userId');

    console.log("Assigned Rides: ", acceptedRides);

    if (!acceptedRides || acceptedRides.length === 0) {
      return res.status(404).send("No accepted bookings found!");
    }

    res.status(200).send(acceptedRides);
  } catch (error) {
    console.error("Error fetching accepted rides: ", error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

// Function to assign driver
const assignDriver = async (req, res) => {
  try {
    const { requestId, driverId } = req.body;
    const booking = await Booking.findById(requestId);
    booking.driverObjectId = driverId;
    booking.status = 'Assigned';
    await booking.save();

    req.app.get('socketio').emit('assignedRequest', booking);

    res.status(200).send({ message: 'Driver assigned', booking });
  } catch (error) {
    console.error('Error assigning driver:', error);
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Function to reassign request
const reassignRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const booking = await Booking.findById(requestId);

    const availableDriver = await findAnotherDriver(booking.driverObjectId, booking.city, booking.vehicleType);
    if (availableDriver) {
      booking.driverObjectId = availableDriver._id;
      await booking.save();
      req.app.get('socketio').emit('assignedRequest', booking);
      res.status(200).send({ message: 'Request reassigned', booking });
    } else {
      res.status(404).send({ message: 'No available drivers' });
    }
  } catch (error) {
    console.error('Error reassigning request:', error);
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};

// Function to delete ride booking
const deleteRideBooking = async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log(requestId);
    const deletedBooking = await Booking.findByIdAndDelete(requestId);
    res.status(200).send(deletedBooking);
  } catch (error) {
    res.status(500).send(error);
  }
}

// Schedule cron job to handle request timeouts
const scheduleRequestTimeout = (bookingId, requestTimer, io) => {
  const cronExpression = `*/${requestTimer} * * * * *`; // Run every 'requestTimer' seconds
  const job = cron.schedule(cronExpression, async () => {
      const booking = await Booking.findById(bookingId);
      console.log(`---------------| Booking Found ${booking} |---------------------`);
    if (!booking) {
      job.stop(); // Stop the cron job if the booking no longer exists
      return;
    }

    const now = new Date();
    const bookingTime = new Date(booking.createdAt).getTime();
    const elapsedTime = (now.getTime() - bookingTime) / 1000; // in seconds

    if (elapsedTime >= booking.requestTimer) {
      const availableDriver = await findAnotherDriver(booking.driverObjectId, booking.vehicleType);
        if (availableDriver) {
            booking.driverObjectId = availableDriver._id;
            await booking.save();
            io.emit('assignedRequest', booking);
      } else {
        booking.status = 'Cancelled';
        await booking.save();
        io.emit('cancelledRequest', booking);
      }
      job.stop(); // Stop the cron job after processing
    }
  });

  // Store the job so it can be cleared if needed
    bookingTimeouts[bookingId] = job;
    console.log("----------Booking TimeOuts: ",bookingTimeouts);
};

module.exports = { rideBooked, getAllAcceptedRides, assignDriver, reassignRequest, deleteRideBooking, scheduleRequestTimeout };
