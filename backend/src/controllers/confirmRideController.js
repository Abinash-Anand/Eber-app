
const Ride = require('../models/createRideModel');

// Get all confirmed rides
const confirmedRide =  async (req, res) => {
  try {
    const rides = await Ride.find({ status: { $in: ['Confirmed', 'Accepted', 'Arrived', 'Picked', 'Started', 'Completed'] } });
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update ride status
const updateRideStatus =  async (req, res) => {
  const { status } = req.body;
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign driver to ride
const assignDriverToRide = async (req, res) => {
  const { driverId } = req.body;
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, { driver: driverId, status: 'Assigned' }, { new: true });
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel ride
const cancelRide =  async (req, res) => {
  try {
    await Ride.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filtering rides
const filterRide = async (req, res) => {
  const { status, vehicleType, username, phoneNumber, requestId, fromDate, toDate } = req.query;
  let filters = {};

  if (status) filters.status = status;
  if (vehicleType) filters.vehicleType = vehicleType;
  if (username) filters.username = username;
  if (phoneNumber) filters.phoneNumber = phoneNumber;
  if (requestId) filters.requestId = requestId;
  if (fromDate) filters.createdAt = { $gte: new Date(fromDate) };
  if (toDate) filters.createdAt = { ...filters.createdAt, $lte: new Date(toDate) };

  try {
    const rides = await Ride.find(filters);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {confirmedRide, updateRideStatus,assignDriverToRide, cancelRide, filterRide}
