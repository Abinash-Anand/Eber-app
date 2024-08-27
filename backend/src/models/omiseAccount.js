const mongoose = require('mongoose');

// Define the Recipient schema
const recipientSchema = new mongoose.Schema({
  accountHolderName: {
    type: String,
    required: true,
  },
  accountHolderEmail: {
    type: String,
    required: true,
    unique: true, // Ensures that each email is unique
  },
  bank_account: {
    bank_name: {
      type: String,
      required: true,
    },
    account_number: {
      type: Number,
        required: true,
        trim: true,
        unique:true
      },
      accountHolderName: {
          type: String,
          required:true
    }
  
  },
  omiseRecipientId: {
    type: String,
    required: true,
    unique: true, // Store the Omise recipient ID
    },
    driverObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "driverModel",
        required: true
  }
});

// Create the Recipient model
const RecipientOmise = mongoose.model('RecipientOmise', recipientSchema);

// Export the Recipient model
module.exports = RecipientOmise;
