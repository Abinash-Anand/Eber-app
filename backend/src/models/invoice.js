const mongoose = require('mongoose');
const Counter = require('../models/mongoose-sequencer');

// Define the invoice schema
const invoiceSchema = new mongoose.Schema({
    invoiceNo: {
        type: Number,
        unique: true,  // Ensures the value is unique
        required: true,
    },
    invoiceDate: {
        type: Date,
        default: Date.now,  // Automatically set to the current date
    },
    dueDate: {
        type: Date,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true,
        unique:true
    },
    EstimatedTime: {
        type: String,
        required: true,
    },
    bookingOption: {
        type: String,
        required: true,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "zoneModel",
        required: true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
        required: true,
    },
    driverObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DriverVehicleModel',
        required: true,
    },
    dropOffLocation: {
        type: String,
        required: true,
    },
    fromLocation: {
        type: String,
        required: true,
    },
    paymentOption: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    scheduleDateTime: {
        type: Date,
        required: true,
    },
    selectedCard: {
        type: String,
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'Cancelled', 'Accepted', 'Arrived', 'Picked', 'Started', 'Completed'],
        default: 'Pending',
    },
    stopLocations: {
        type: String,
        default: "[]",
    },
    toLocation: {
        type: String,
        required: true,
    },
    totalDistance: {
        type: String,
        required: true,
    },
    vehicleImageURL: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true,
    },
    requestTimer: {
        type: Number,
        required: true,
    },
    tripFare: {
        type: Number,
        required: true,
    },
    platformCharge: {
        type: Number,
        required: true
    },
    totalFare: {
        type: Number,
        required: true
    },
    // Add the feedback property
   feedback: {
    driverRating: {
        type: Number,
        required: false,
        default: 0,  // Default value for driverRating
    },
    friendly: {
        type: Boolean,
        required: false,
        default: false,  // Default value for friendly
    },
    lateArrival: {
        type: Boolean,
        required: false,
        default: false,  // Default value for lateArrival
    },
    onTime: {
        type: Boolean,
        required: false,
        default: true,  // Default value for onTime
    },
    rideRating: {
        type: Number,
        required: false,
        default: 0,  // Default value for rideRating
    },
    smoothDrive: {
        type: Boolean,
        required: false,
        default: false,  // Default value for smoothDrive
    },
    trafficRules: {
        type: Boolean,
        required: false,
        default: true,  // Default value for trafficRules
    }
}

}, { timestamps: true });

// Create the index on invoiceNo for uniqueness
// invoiceSchema.index({ invoiceNo: 1 }, { unique: true });

// Export the model
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
