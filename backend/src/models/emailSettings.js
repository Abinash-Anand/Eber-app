const mongoose = require('mongoose');

const emailSettingsSchema = new mongoose.Schema({
  smtpHost: {
    type: String,
    required: true,
    default: 'smtp.ethereal.email' // Default to Ethereal for testing, update as needed
  },
  smtpPort: {
    type: Number,
    required: true,
    default: 587
  },
  secureConnection: {
    type: Boolean,
    required: true,
    default: false // Set to true if using SSL/TLS (e.g., port 465)
  },
  emailUser: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  emailPass: {
    type: String,
    required: true
  },
  fromName: {
    type: String,
    required: true,
    trim: true
  },
  fromEmail: {
    type: String,
    required: true,
    trim: true
  },

});


const EmailSettings = mongoose.model('EmailSettings', emailSettingsSchema);

module.exports = EmailSettings;
