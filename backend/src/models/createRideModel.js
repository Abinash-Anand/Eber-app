const mongoose = require('mongoose');
const rideSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required:true
    },
    phone: {
        type: Number,
        required: true,
    },
    paymentOption: {
        type: String,
        required: true,
    },
    selectedCard: {
        type: String,
    },
    fromLocation: {
        type: String,
        required: true,
    },
    toLocation: {
        type: String,
        required: true,
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    dropOffLocation: {
        type: String,
        required: true,
    },
    stopLocations: {
        type: String,
       
    },
    totalDistance: {
        type: String,
        required: true,
    },
    EstimatedTime: {
        type: String,
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
    },
    bookingOption: {
        type: String,
        required: true,
    },
    scheduleDateTime: {
        type: String,
      
    },
},{timestamps:true});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;