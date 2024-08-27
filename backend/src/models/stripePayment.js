const mongoose = require('mongoose');

// Define the payment method schema with an additional stripeCustomerId field
const paymentMethodSchema = new mongoose.Schema({
  payment_method_id: { type: String, required: true, unique: true }, // Stripe payment method ID
  card_brand: { type: String, required: true },
  card_last4: { type: String, required: true, unique: true },
  card_exp_month: { type: Number, required: true },
  card_exp_year: { type: Number, required: true },
  client_ip: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // MongoDB ObjectId for user reference
  stripeCustomerId: { type: String, required: true }, // Add this field to store Stripe customer ID
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
