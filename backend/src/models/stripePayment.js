const mongoose = require('mongoose');

const paymentTokenSchema = new mongoose.Schema({
  token_id: { type: String, required: true },
  card_brand: { type: String, required: true },
  card_last4: { type: String, required: true, unique: true },
  card_exp_month: { type: Number, required: true },
  card_exp_year: { type: Number, required: true },
  token_created: { type: Number, required: true },
  client_ip: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const PaymentToken = mongoose.model('PaymentToken', paymentTokenSchema);

module.exports = PaymentToken;
