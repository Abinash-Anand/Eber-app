const mongoose = require('mongoose');
const { type } = require('os');
const zoneSchema = new mongoose.Schema({
    countryId: {
        type: String,
        required: true,
        trim: true,

    },
    country: {
        type: String,
        required: true,
        
    },
      city: {
            type: String,
            required: true,
            trim: true,
            unique:true
        },
    latLngCoords: {
        type: String,
        required: true,
        
    }
})

const zoneModel = mongoose.model('zoneModel', zoneSchema)
module.exports = zoneModel