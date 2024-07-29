const mongoose = require('mongoose');
const driverVehicleSchema = mongoose.Schema({
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'zoneModel',
        required:true,
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required:true,
    },
    driverObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'driverModel',
        required:true,
    },
    basePrice: {
        type: Number, required: true
    },
    distanceForBasePrice: {
        type: Number, required: true
    },
    driverProfit: {
        type: Number, required: true
    },
    maxSpace: {
        type: Number, required: true
    },
    minFare: {
        type: Number, required: true
    },
    pricePerUnitDistance: {
        type: Number, required: true
    },
    pricePerUnitTime: {
        type: Number, required: true
    },
    vehicleImageURL: {
        type: String, required: true
    },
    vehicleName: {
        type: String, required: true
    },
    vehicleType: {
        type: String, required: true
    },


}, { timestamps: true })

const DriverVehicleModel = mongoose.model('DriverVehicleModel', driverVehicleSchema);
module.exports =  DriverVehicleModel

