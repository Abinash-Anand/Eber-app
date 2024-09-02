
  
const mongoose = require('mongoose');
const customAccountSchema = mongoose.Schema({
    country: {
        type: String,
        required: true,
        
  },
    type: {
        type: String,
        required:true,
  },
  capabilities: {
    card_payments: {
      requested: {
            type: Boolean,
            required: true,
            default:false,
      },
    },
    transfers: {
        requested: {
        type: Boolean,
        required: true,
        default: false,
      },
      },
    email: {
    type: String,
    required: false,
    // match: [/\S+@\S+\.\S+/, 'is invalid'],  // Optional: Only if you want to store the email associated with the account
  },
},
}, {timestamps:true})

const CustomAccount =  mongoose.model('CustomAccount', customAccountSchema)