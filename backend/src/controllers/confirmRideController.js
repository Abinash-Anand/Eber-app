const Ride = require('../models/createRideModel');
const User = require('../models/usersModel');

// Fetch all confirmed rides
const getConfirmedRides = async (req, res) => {
    try {
        const rides = await Ride.find().populate('userId', 'username');
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assign a driver to a ride
const assignDriver = async (req, res) => {
    const { id } = req.params;
    const { driverId } = req.body;
    try {
        const ride = await Ride.findById(id);
        if (ride) {
            ride.driverId = driverId;
            ride.status = 'Assigned';
            await ride.save();
            res.status(200).json({ message: 'Driver assigned successfully', ride });
        } else {
            res.status(404).json({ message: 'Ride not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel a ride
const cancelRide = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const ride = await Ride.findById(id);
        if (ride) {
            if (ride.status === 'Pending') {
                await Ride.deleteOne({ _id: id });
                res.status(200).json({ message: 'Ride canceled successfully' });
            } else {
                res.status(400).json({ message: 'Cannot cancel a ride that has been accepted' });
            }
        } else {
            res.status(404).json({ message: 'Ride not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Method to update the status of a ride
const updateRideStatus = async (req, res) => {
    try {
        const { _id, status } = req.body;
        console.log({ _id, status });
        const ride = await Ride.findByIdAndUpdate(_id, { status }, { new: true });
        if (!ride) {
            return res.status(404).send({ error: 'Ride not found' });
        }
        res.send(ride);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
};


module.exports = { getConfirmedRides, assignDriver, cancelRide, updateRideStatus };
