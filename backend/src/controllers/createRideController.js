const Ride = require('../models/createRideModel')

const createNewRide = async (req, res, io) => {
    try {
        const { userId,phone, paymentOption,selectedCard, fromLocation, toLocation,
                 pickupLocation, dropOffLocation, stopLocations,
                 totalDistance, EstimatedTime, serviceType, bookingOption,
            scheduleDateTime, requestTimer } = req.body;
    // Handle undefined values for stopLocations and EstimatedTime
        const validatedStopLocations = stopLocations || '';
        // const validatedEstimatedTime = EstimatedTime || '';
           // Validate required fields
        if (!userId || !phone || !paymentOption || !selectedCard || !fromLocation || !toLocation ||
            !pickupLocation || !dropOffLocation || !totalDistance ||
            !EstimatedTime || !serviceType || !bookingOption || !requestTimer) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const newRideBooking = new Ride({
            userId,
            phone,
            paymentOption,
            selectedCard,
            fromLocation,
            toLocation,
            pickupLocation,
            dropOffLocation,
            stopLocations:validatedStopLocations,
            totalDistance,
            EstimatedTime,
            serviceType,
            bookingOption,
            scheduleDateTime,
            requestTimer
        });
        await newRideBooking.save();
        
    io.emit('newRide', newRideBooking); // 'newRide' is the event name, newRideBooking is the data sent with the event

        res.status(200).json({ success: true, data: newRideBooking }); // Ensure the response format is correct
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
const deleteRideFromRides = async (req, res) => {
    try {
        const requestId = req.params.id
        const deleteRide = await Ride.findByIdAndDelete(requestId);
        res.status(200).json({message:"Requested Booking Deleted"})
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {createNewRide, deleteRideFromRides}