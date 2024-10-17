// models/twilioSettings.js
const mongoose = require('mongoose');

const twilioSettingsSchema = new mongoose.Schema({
  accountSid: {
    type: String,
    required: true,
    trim: true,
  },
  authToken: {
    type: String,
    required: true,
  },
  twilioPhoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
    trim: true,
  },
  defaultMessage: {
    type: String,
    default: 'This is a default SMS message',
  },
  whatsappMessage: {
    type: String,
    default: 'This is a default WhatsApp message',
  },
});

const TwilioSettings = mongoose.model('TwilioSettings', twilioSettingsSchema);

module.exports = TwilioSettings;
