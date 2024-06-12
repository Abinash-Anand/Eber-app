// models/Country.js
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
    currency: {
      
    type: String,
    required: true
  },
  countryCallingCode: {
    type: String,
    required: true,
    unique:true
  },
  countryCode: {
    type: String,
    required: true,
    unique:true
  },
  flag: {
    type: String,
    required: true,
    unique:true
  },
  timeZone: {
    type: String,
    required: true
  }
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
