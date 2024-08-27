const mongoose = require('mongoose');

// Define the Virtual Account schema
const virtualAccountSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to the Customer model
    required: true,
  },
  razorpayVirtualAccountId: {
    type: String,
    required: true,
    unique: true, // This is the virtual account ID from Razorpay
  },
  description: {
    type: String,
    required: true,
  },
  closeBy: {
    type: Date,
  },
  notes: {
    type: Map,
    of: String,
  },
});

// Create the VirtualAccount model
const VirtualAccount = mongoose.model('VirtualAccount', virtualAccountSchema);

module.exports = VirtualAccount;
