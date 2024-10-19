const mongoose = require('mongoose');

const stripeSettingsSchema = new mongoose.Schema({
  stripeSecretKey: {
    type: String,
    required: true,
    trim: true,
  },
  defaultCurrency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD'], // Add any other currencies you may use
    default: 'USD',
  },
  driverPayoutFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'weekly',
    },
    stripeMode: {
        type: String,
        enum: ['Live', 'Test'],
        default:'Test'
    },
    
 
});


module.exports = mongoose.model('StripeSettings', stripeSettingsSchema);
