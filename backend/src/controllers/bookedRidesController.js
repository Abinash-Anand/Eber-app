
const Booking = require('../models/rideBookings'); // Ensure the correct path to your model

const rideBooked = async (req, res) => {
  try {
    const {
      EstimatedTime, bookingOption, driver, dropOffLocation, fromLocation,
      paymentOption, phone, pickupLocation, scheduleDateTime,
      selectedCard, serviceType, status, stopLocations, toLocation,
      totalDistance, userId
    } = req.body;

      if (!EstimatedTime || !bookingOption || !driver || !dropOffLocation ||
          !fromLocation || !paymentOption || !phone || !pickupLocation || !scheduleDateTime
          || !selectedCard || !serviceType || !status || !toLocation || !totalDistance || !userId) {
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
      vehicleImageURL: driver.vehicleImageURL,
      vehicleName: driver.vehicleName,
      vehicleType: driver.vehicleType
    });

    console.log("New Booking Object: ", newBooking);

    await newBooking.save();
    res.status(201).send({ Message: "New Booking Created", newBooking });
  } catch (error) {
    console.error("Error in rideBooked: ", error);
    res.status(500).send({ Message: "Internal Server Error", error });
  }
};

const getAllAcceptedRides = async (req, res) => {
  try {
    // Use await to ensure the query is awaited
    const acceptedRides = await Booking.find({ status: 'Accepted' });

    // Log the result
    console.log("Accepted Rides: ", acceptedRides);

    // Check if acceptedRides is empty or null
    if (!acceptedRides || acceptedRides.length === 0) {
      return res.status(404).send("No accepted bookings found!");
    }

    // Send the result
    res.status(200).send(acceptedRides);
  } catch (error) {
    // Log the error
    console.error("Error fetching accepted rides: ", error);

    // Send the error response
    res.status(500).send({ message: "Internal Server Error", error });
  }
}
const assignDriver = async (req, res) => {
  try {
    const { requestId, driverId } = req.body;
    const booking = await Booking.findById(requestId);
    booking.driver.driverObjectId = driverId;
    booking.status = 'Assigned';
    await booking.save();

    req.app.get('socketio').emit('assignedRequest', booking);

    res.status(200).send({ message: 'Driver assigned', booking });
  } catch (error) {
    console.error('Error assigning driver:', error);
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};
module.exports = { rideBooked , getAllAcceptedRides, assignDriver};
