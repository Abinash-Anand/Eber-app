// controllers/driverAssignedRide.js
const DriverAssignedRide = require('../models/driverAssignedRides');

const assignedDriver = async (req, res, io) => {
    try {
        console.log(req.body);
        const newRideAssigned = new DriverAssignedRide(req.body);
        await newRideAssigned.save();

        // Emit the event using the socket instance
        io.emit('driverAssigned', newRideAssigned);

        res.status(200).json({
            message: 'Driver Assigned request can be accepted now!',
            newRideAssigned
        });
    } catch (error) {
        console.error('Error assigning driver:', error); // Log the error details
        res.status(500).json({
            message: 'An error occurred while assigning the driver.',
            error: error.message // Include the error message for better debugging
        });
    }
};

module.exports = { assignedDriver };
