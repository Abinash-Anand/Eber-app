const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const subscriptionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you have a User model, to link subscriptions to users
    required: false
  },
  endpoint: {
    type: String,
    required: true
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
  },
  
},{timestamps:true});

// Check if the model has already been compiled
module.exports = mongoose.model('SubscriptionNotification', subscriptionSchema);
