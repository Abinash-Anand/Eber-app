const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the subscription
const subscriptionSchema = new Schema({
  endpoint: {
    type: String,
    required: true
  },
  expirationTime: {
    type: Date,
    default: null
  },
  keys: {
    p256dh: {
      type: String,
      required: true
    },
    auth: {
      type: String,
      required: true
    }
  }
});

// Create and export the model
module.exports = mongoose.model('Subscription', subscriptionSchema);
