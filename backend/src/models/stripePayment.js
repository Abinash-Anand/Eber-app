const mongoose = require('mongoose');

const paymentTokenSchema = new mongoose.Schema({
  token_id: { type: String, required: true, unique: true },
  card_brand: { type: String, required: true },
  card_last4: { type: String, required: true, unique: true },
  card_exp_month: { type: Number, required: true },
  card_exp_year: { type: Number, required: true },
  token_created: { type: Number, required: true },
  client_ip: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  cardNumber:{type:String, required:true, unique:true}
});

// paymentTokenSchema.index({ token_id: 1 }, { unique: true });
// paymentTokenSchema.index({ card_last4: 1 }, { unique: true });

const PaymentToken = mongoose.model('PaymentToken', paymentTokenSchema);

// // Ensure indexes are created
// PaymentToken.on('index', (error) => {
//   if (error) {
//     console.error('Indexes were not created:', error);
//   } else {
//     console.log('Indexes created successfully');
//   }
// });

module.exports = PaymentToken;
