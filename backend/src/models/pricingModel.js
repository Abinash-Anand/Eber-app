const mongoose = require('mongoose');
const pricingSchema = mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'zoneModel',
        required: true
    },
    vehicleType: {
        type: String,
        required: true,
        
    },
    driverProfit: {
        type: Number,
        required: true,
    },
    minFare: {
        type: Number,
        required: true,
    },
    distanceForBasePrice: {
        type: Number,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
        
    },
    pricePerUnitDistance: {
        type: Number,
        required: true,
        
    },
    pricePerUnitTime: {
        type: Number,
        required: true,
        
    },
    maxSpace: {
        type: Number,
        required: true,
        
    },
});
pricingSchema.index({ country: 1, city: 1, vehicleType: 1 }, { unique: true });

const Pricing = mongoose.model('Pricing', pricingSchema);
// module.exports = Pricing
module.exports = Pricing;
