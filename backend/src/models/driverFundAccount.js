const mongoose = require('mongoose');

const fundAccountSchema = new mongoose.Schema({
    driverObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        refs: 'driverModel',
        required:true
    },
  id: {
    type: String,
    required: true,
    unique: true // Ensures that each fund account ID is unique
  },
  entity: {
    type: String,
    required: true
  },
  contact_id: {
    type: String,
    required: true,
    unique: true
  },
  account_type: {
    type: String,
    required: true
  },
  bank_account: {
    ifsc: {
      type: String,
      required: true
    },
    bank_name: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    notes: {
      type: Array,
      default: []  // Default to an empty array if no notes are provided
    },
    account_number: {
      type: String,
      required: true
    }
  },
  batch_id: {
    type: mongoose.Schema.Types.Mixed, // Accepts null, zero, or string
    default: null
  },
  active: {
    type: Boolean,
    default: true // Defaults to true, assuming newly created accounts are active
  },
  created_at: {
    type: Number,
    required: true
  }
}, {
  timestamps: true  // Automatically creates createdAt and updatedAt timestamps
});

const FundAccount = mongoose.model('FundAccount', fundAccountSchema);

module.exports = FundAccount;
