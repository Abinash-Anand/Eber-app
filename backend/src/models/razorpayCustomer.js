const mongoose = require('mongoose');

// Define the Customer schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  razorpayCustomerId: {
    type: String,
    required: true,
    unique: true, // This is the customer ID from Razorpay
  },
  notes: {
    type: Map,
    of: String,
    }, 
    entity: {
        type: String,
        required: true,
    }
});

// Create the Customer model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
