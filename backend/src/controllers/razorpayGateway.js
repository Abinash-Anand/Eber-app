require('dotenv')
const axios = require('axios');
const Razorpay = require('razorpay');
const Driver = require('../models/driverModel')
// Set up your Razorpay credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay API Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay API Key Secret
});




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
//   console.log("Inside CreateContact: ", contactData)
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
    console.error('Error creating contact:', error.response.data);
    throw error;
  }
};

// Call the function to create a contact
createContact().then((contact) => {
  console.log('Created Contact:', contact);
}).catch((error) => {
  console.error('Error:', error.message);
});
//----------------------deactivate the contact-----------------------------------
// const contactId = 'cont_Op7bxiIh0Lt36S'

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
// Call the function to deactivate the contact
// deactivateContact(contactId).then((result) => {
//   console.log('Deactivated Contact:', result);
// }).catch((error) => {
//   console.error('Error:', error.message);
// });

//===================CREATE A FUND ACCOUNT============================================

const createFundAccount = async (driver) => {
  const fundAccountData = {
    contact_id: driver.contactId,
    account_type: 'bank_account',  // or 'vpa' for UPI
    bank_account: {
      name: driver.username,
      ifsc: 'HDFC0000053',  // Example IFSC code
      account_number: '765432123456789',  // Example account number
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

// Call the function to create a fund account
// createFundAccount(contactId).then((fundAccount) => {
//   console.log('Created Fund Account:', fundAccount);
// }).catch((error) => {
//   console.error('Error:', error.message);
// });


//===========================================================================================



// Function to create a Razorpay payout
const createRazorpayPayout = async (driverAccountId, booking) => {
    try {
        // Create a payout to the driver's bank account
        const payoutResponse = await razorpayInstance.payouts.create({
            account_number: process.env.RAZORPAY_ACCOUNT_NUMBER, // Your Razorpay account number
            fund_account_id: driverAccountId, // Driver's fund account ID (created using Razorpay's API)
            amount: amount * 100, // Amount in paise (e.g., ₹10.00 should be 1000)
            currency: currency, // Currency of the payout, e.g., 'INR'
            mode: 'IMPS', // Payment mode ('IMPS', 'NEFT', 'RTGS', or 'UPI')
            purpose: 'payout', // Purpose of the transfer
            queue_if_low_balance: true, // Whether to queue the payout if there is low balance
            reference_id: `txn_${new Date().getTime()}`, // Unique transaction reference ID
            narration: 'Payout for ride completion', // Transaction narration
        });

        console.log('Payout created successfully:', payoutResponse);
        return payoutResponse;
    } catch (error) {
        console.error('Error creating payout:', error);
        throw error;
    }
};

// // Example usage
// createRazorpayPayout('driver_fund_account_id', 500, 'INR')
//     .then(response => {
//         console.log('Payout response:', response);
//     })
//     .catch(error => {
//         console.error('Error during payout:', error.message);
//     });

    module.exports = {createContact, deactivateContact, createFundAccount, createRazorpayPayout}