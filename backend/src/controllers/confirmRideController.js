const Ride = require('../models/createRideModel');
const User = require('../models/usersModel');
const Booking = require('../models/rideBookings')
// Fetch all confirmed rides
const getConfirmedRides = async (req, res) => {
    try {
        const Rides = await Ride.find().populate('userId', 'username');

        // Corrected filtering condition to use AND (&&) instead of OR (||)
        const rides = Rides.filter((ride) => {
            return ride.status !== 'Completed' && ride.status !== 'Cancelled';
        });

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
const mongoose = require('mongoose');

const cancelRide = async (req, res) => {
    const { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ride ID format' });
    }

    try {
        const ride = await Ride.findById(id);
        if (ride) {
            if (ride.status === 'Pending') {
                ride.status = "Cancelled";
                await ride.save();         
                res.status(200).json(ride);
            } else {
                res.status(400).json({ message: 'Cannot cancel a ride that has been accepted or already processed' });
            }
        } else {
            res.status(404).json({ message: 'Ride not found' });
        }
    } catch (error) {
        console.error('Error cancelling ride:', error); // Logging the error
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
