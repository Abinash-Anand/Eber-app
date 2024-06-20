const mongoose = require('mongoose');
const { type } = require('os');
const zoneSchema = new mongoose.Schema({
    countryId: {
        type: String,
        required: true,
        trim: true,

    },
      city: {
            type: String,
            required: true,
            trim:true
        },
    latLngCoords: {
        type: String,
        required: true,
        
    }
})

const zoneModel = mongoose.model('zoneModel', zoneSchema)
module.exports = zoneModel