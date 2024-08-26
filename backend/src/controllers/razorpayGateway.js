require('dotenv').config(); // Correctly load environment variables

const axios = require('axios');
const Razorpay = require('razorpay');
const Driver = require('../models/driverModel');
const Account = require('../models/driverFundAccount');
const chalk = require('chalk');

// Check environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in .env file');
}

// Set up your Razorpay credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay API Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay API Key Secret
});

// Ensure the Razorpay instance is initialized correctly
if (!razorpayInstance) {
  console.error('Failed to initialize Razorpay instance');
  throw new Error('Razorpay instance is not defined');
}

const createContact = async (driver) => {
  const contactData = {
    name: driver.username, // The driver's name
    email: driver.email, // The driver's email
    contact: driver.phone, // The driver's contact number
    type: 'vendor', // Type of contact
    reference_id: driver._id, // Your reference ID for this contact (optional)
    notes: {
      note_key_1: 'This is the first note',
      note_key_2: 'This is the second note'
    }
  };

  try {
    const response = await axios.post('https://api.razorpay.com/v1/contacts', contactData, {
      auth: {
        username: process.env.RAZORPAY_KEY_ID, // Your Razorpay API Key ID
        password: process.env.RAZORPAY_KEY_SECRET // Your Razorpay API Key Secret
      }
    });

    console.log('Contact created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error.response ? error.response.data : error.message);
    throw error;
  }
};

//---------------------- Deactivate the contact -----------------------------------
const deactivateContact = async (contactId) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.razorpay.com/v1/contacts/${contactId}`,
      auth: {
        username: process.env.RAZORPAY_KEY_ID,  // Your Razorpay API Key ID
        password: process.env.RAZORPAY_KEY_SECRET // Your Razorpay API Key Secret
      },
      data: {
        active: false // Set the contact to inactive
      }
    });

    console.log('Contact deactivated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deactivating contact:', error.response ? error.response.data : error.message);
    throw error;
  }
};

//=================== CREATE A FUND ACCOUNT ============================================

const createFundAccount = async (driver) => {
  const fundAccountData = {
    contact_id: driver.contactId,
    account_type: 'bank_account', // or 'vpa' for UPI
    bank_account: {
      name: driver.username,
      ifsc: 'HDFC0000053', // Example IFSC code
      account_number: '765432123456789', // Example account number
    }
  };

  try {
    const response = await axios.post('https://api.razorpay.com/v1/fund_accounts', fundAccountData, {
      auth: {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET,
      }
    });

    console.log('Fund account created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating fund account:', error.response ? error.response.data : error.message);
    throw error;
  }
};

//===========================================================================================

// Function to create a Razorpay payout

const createRazorpayPayout = async (driver, driverShare, paymentIntent) => {
  try {
    const fundAccount = await Account.findOne({ driverObjectId: driver._id });
    if (!fundAccount) {
      throw new Error('Fund account not found!');
    }

    console.log('Fund Account:', fundAccount);

    // Setup the request parameters for Razorpay payout
    const payoutParams = {
      account_number: fundAccount.bank_account.account_number, // Your Razorpay account number or Customer Identifier
      fund_account_id: fundAccount.id, // Driver's fund account ID
      amount: driverShare, // Amount in paise (e.g., ₹10.00 should be 1000)
      currency: "INR", // Correct currency for payouts, e.g., 'INR'
      mode: 'IMPS', // Payment mode ('IMPS', 'NEFT', 'RTGS', or 'UPI')
      purpose: 'payout', // Purpose of the payout
      queue_if_low_balance: true, // Whether to queue the payout if there is low balance
      reference_id: `txn_${new Date().getTime()}`, // Unique transaction reference ID
      narration: 'Payout for ride completion', // Transaction narration
    };

    // Create a payout using Axios to call the Razorpay API endpoint
    const response = await axios.post('https://api.razorpay.com/v1/payouts', payoutParams, {
      auth: {
        username: process.env.RAZORPAY_KEY_ID, // Your Razorpay API Key ID
        password: process.env.RAZORPAY_KEY_SECRET // Your Razorpay API Key Secret
      }
    });

    console.log('Payout created successfully:', response.data);
    return response.data;
  } catch (error) {
    // Log detailed error if available
    if (error.response) {
      console.error('Error creating payout:', error.response.data);
    } else {
      console.error('Error creating payout:', error.message);
    }
    throw error;
  }
};

module.exports = { createRazorpayPayout };


module.exports = { createContact, deactivateContact, createFundAccount, createRazorpayPayout };
