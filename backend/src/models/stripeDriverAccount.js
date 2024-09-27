const mongoose = require('mongoose');

const customAccountSchema = mongoose.Schema(
  {
    // Stripe Account ID
    stripe_account_id: {
      type: String,
      required: true,
      unique: true,
    },
    driverObjectId: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true,
      ref:'driverModel',
    },
    // Step 1: Account creation fields (required)
    email: {
      type: String,
      required: true,
      unique: true, // Assuming email should be unique
    },
    country: {
      type: String,
      required: true,
      enum: ['DE'], // Fixed value for Germany
      default: 'DE',
    },
    type: {
      type: String,
      required: true,
      enum: ['custom'], // Only 'custom' type as per your setup
      default: 'custom',
    },
    business_type: {
      type: String,
      required: true,
      enum: ['individual', 'company'],
      default: 'individual',
    },
    individual: {
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      dob: {
        day: {
          type: String,
          required: true,
        },
        month: {
          type: String,
          required: true,
        },
        year: {
          type: String,
          required: true,
        },
      },
      address: {
        line1: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        postal_code: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
          default: 'DE',
        },
      },
    },

    // Step 1: Business Profile (only URL is required initially)
    business_profile: {
      url: {
        type: String,
        required: true, // Business profile URL is required
        default: 'http://localhost:4200/drivers/driver-list', // Default URL, can be replaced
      },
      mcc: {
        type: String,
        default: null, // Optional
      },
    },

    // Step 2: External Bank Account (optional)
    external_account: {
      object: {
        type: String,
        default: '', // Default to empty string
      },
      country: {
        type: String,
        default: '', // Default to empty string
      },
      currency: {
        type: String,
        default: '', // Default to empty string
      },
      account_holder_name: {
        type: String,
        default: null, // Optional
      },
      account_holder_type: {
        type: String,
        default: '', // Default to empty string
      },
      account_number: {
        type: String,
        default: null, // Optional
      },
    },

    // Step 2: Capabilities (optional)
    capabilities: {
      card_payments: {
        requested: {
          type: String,
          default: 'Inactive', // Optional
        },
      },
      transfers: {
        requested: {
          type: String,
          default: 'Inactive', // Optional
        },
      },
    },

    // Step 2: Terms of Service Acceptance (optional)
    tos_acceptance: {
      date: {
        type: Number,
        default: null, // Optional
      },
      ip: {
        type: String,
        default: null, // Optional
      },
    },
  },
  { timestamps: true }
);

const CustomAccount = mongoose.model('CustomAccount', customAccountSchema);

module.exports = CustomAccount;
