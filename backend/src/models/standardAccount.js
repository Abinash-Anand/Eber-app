// models/standardAccount.js
const mongoose = require('mongoose');

const standardAccountSchema = new mongoose.Schema({
  stripe_account_id: { type: String, required: true },
  driverObjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'driverModel', required: true },
  email: { type: String, required: true },
  business_url: { type: String, required: true },
 
}, {timestamps:true});

module.exports = mongoose.model('StandardAccount', standardAccountSchema);
