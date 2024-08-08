const Booking = require('../models/rideBookings'); // Ensure the correct path to your model
const cron = require('node-cron'); // For scheduling tasks
const driverModel = require('../models/driverVehiclePricingModel'); // Ensure the correct path to your model
const DriverVehicleModel = require('../models/driverVehiclePricingModel')
const Ride = require('../models/createRideModel')
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
    // scheduleRequestTimeout(newBooking._id, requestTimer, io);

    res.status(201).send({ Message: "New Booking Created", newBooking });
  } catch (error) {
    console.error("Error in rideBooked: ", error);
    res.status(500).send({ Message: "Internal Server Error", error });
  }
};

const findAnotherDriver = async (driverObjectId, cityId, vehicleType) => {
  try {
    // Find the driver using the driverObjectId and populate driver details
    const driver = await DriverVehicleModel.findOne({ driverObjectId }).populate('driverObjectId').lean();
    console.log(`-------------| Driver Found: ${JSON.stringify(driver, null, 2)} |-----------`);
    console.log(`-------------| Driver's City: ${JSON.stringify(driver.driverObjectId.city, null, 2)} |-----------`);

    if (!driver || !driver.driverObjectId) {
      console.log('Driver not found or driver details not populated');
      return null;
    }

    // Log parameters before querying for available drivers
    console.log(`Searching for available drivers with cityId: ${cityId}, vehicleType: ${vehicleType}, excluding driverObjectId: ${driverObjectId}`);
    
    // Find another available driver with the same city and vehicle type, but different from the current driver
    const availableDriver = await driverModel.findOne({
      _id: { $ne: driverObjectId }, // Ensure the new driver is different
      city: Objee(cityId), // Ensure the city matches
      vehicleType: vehicleType, // Ensure the vehicle type matches
      status: 'approved', // Ensure the status is approved
    }).lean();

    console.log(`-------------| Available Driver Found: ${JSON.stringify(availableDriver, null, 2)} |-----------`);

    if (!availableDriver) {
      console.log('No available driver found');
      return null;
    }

    console.log(`-------------| Available Driver Found: ${JSON.stringify(availableDriver, null, 2)} |-----------`);

    return availableDriver;
  } catch (error) {
    console.error('Error finding another driver:', error);
    return null;
  }
};


// Function to get all accepted rides
const getAllAcceptedRides = async (req, res) => {
  try {
    const acceptedRides = await Booking.find().populate('userId');

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

const assignDriver = async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log('requestId:', requestId);

    const booking = await Booking.findOne({ _id: requestId });
    if (!booking) {
      console.error(`Booking not found for requestId: ${requestId}`);
      return res.status(404).send({ message: 'Booking not found' });
    }

    const originalBookingObject = await Ride.findOne({ _id: booking.bookingId });
    if (!originalBookingObject) {
      console.error(`Original booking not found for bookingId: ${booking.bookingId}`);
      return res.status(404).send({ message: 'Original booking not found' });
    }

    console.log('Original Booking before update:', originalBookingObject);

    // Update statuses
    booking.status = 'Accepted';
    originalBookingObject.status = 'Accepted';

    // Save both objects
    await booking.save();
    await originalBookingObject.save(); // Ensure you save the updated originalBookingObject

    console.log('Original Booking after update:', originalBookingObject);
    console.log('----------------Ride Request Accepted by driver---------------------');

    req.app.get('socketio').emit('assignedRequest', booking.status);
    res.status(200).send({ message: 'Driver Accepted the request', booking });
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

const deleteRideBooking = async (req, res) => {
  try {
    const requestId = req.params.id;
    console.log('Request ID:', requestId);

    // Find the booking by requestId to get the bookingId
    const booking = await Booking.findById(requestId);
    if (!booking) {
      console.error(`Booking not found for requestId: ${requestId}`);
      return res.status(404).send({ message: 'Booking not found' });
    }

    const bookingId = booking.bookingId;

    // Delete the associated Ride document
    const deleteOriginalBooking = await Ride.findByIdAndDelete(bookingId);
    console.log('Original booking deleted:', deleteOriginalBooking);

    // Delete the Booking document
    const deletedBooking = await Booking.findByIdAndDelete(requestId);
    console.log('Booking deleted:', deletedBooking);

    res.status(200).send({ message: 'Succeeded' });
  } catch (error) {
    console.error('Error deleting ride booking:', error);
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};

let count = 1;
// Schedule cron job to handle request timeouts
const scheduleRequestTimeout = (bookingId, requestTimer, io) => {
    //  setInterval(() => {
        
    //     console.log("CountDown: ", count);
    //     count++
    //     if (count > 60) {
    //         return 
    //     }
    // }, 1000);
  const timeout = setTimeout(async () => {
    const booking = await Booking.findOne(bookingId);
    if (!booking) {
      clearTimeout(bookingTimeouts[bookingId]); // Clear the timeout if the booking no longer exists
      delete bookingTimeouts[bookingId];
      return;
    }

    const now = new Date();
    const bookingTime = new Date(booking.createdAt).getTime();
    const elapsedTime = (now.getTime() - bookingTime) / 1000; // in seconds

    if (elapsedTime >= booking.requestTimer) {
      const availableDriver = await findAnotherDriver(booking.driverObjectId, booking.city, booking.vehicleType);
      if (availableDriver) {
        booking.driverObjectId = availableDriver._id;
        await booking.save();
        io.emit('assignedRequest', booking);
      } else {
        booking.status = 'Cancelled';
        await booking.save();
        io.emit('cancelledRequest', booking);
      }
      clearTimeout(bookingTimeouts[bookingId]); // Clear the timeout after processing
      delete bookingTimeouts[bookingId];
    }
  }, requestTimer * 1000); // Convert requestTimer from seconds to milliseconds

  // Store the timeout so it can be cleared if needed
  bookingTimeouts[bookingId] = timeout;
  console.log("----------Booking TimeOuts: ", bookingTimeouts);
};

module.exports = { rideBooked, getAllAcceptedRides, assignDriver, reassignRequest, deleteRideBooking, scheduleRequestTimeout };


