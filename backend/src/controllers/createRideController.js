const Ride = require('../models/createRideModel')

const createNewRide = async (req, res) => {
    try {
        const { userId,phone, paymentOption,selectedCard, fromLocation, toLocation,
                 pickupLocation, dropOffLocation, stopLocations,
                 totalDistance, EstimatedTime, serviceType, bookingOption,
            scheduleDateTime } = req.body;
    // Handle undefined values for stopLocations and EstimatedTime
        const validatedStopLocations = stopLocations || '';
        // const validatedEstimatedTime = EstimatedTime || '';
           // Validate required fields
        if (!userId || !phone || !paymentOption || !selectedCard || !fromLocation || !toLocation ||
            !pickupLocation || !dropOffLocation || !totalDistance ||
            !EstimatedTime || !serviceType || !bookingOption) {
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
            scheduleDateTime
        });

        await newRideBooking.save();
        
        res.status(200).json({ success: true, data: newRideBooking }); // Ensure the response format is correct
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {createNewRide}