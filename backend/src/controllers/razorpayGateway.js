// require('dotenv').config(); // Correctly load environment variables

// const axios = require('axios');
// const Razorpay = require('razorpay');
// const Driver = require('../models/driverModel');
// const Account = require('../models/driverFundAccount');
// const chalk = require('chalk');
// const Customer = require('../models/razorpayCustomer')
// // const VirtualAccount = require('../models/razorpayVirtualAccount')

// // Check environment variables
// if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
//   throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in .env file');
// }

// // Set up your Razorpay credentials
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay API Key ID
//   key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay API Key Secret
// });

// // Ensure the Razorpay instance is initialized correctly
// if (!razorpayInstance) {
//   console.error('Failed to initialize Razorpay instance');
//   throw new Error('Razorpay instance is not defined');
// }

// const createContact = async (driver) => {
//   const contactData = {
//     name: driver.username, // The driver's name
//     email: driver.email, // The driver's email
//     contact: driver.phone, // The driver's contact number
//     type: 'vendor', // Type of contact
//     reference_id: driver._id, // Your reference ID for this contact (optional)
//     notes: {
//       note_key_1: 'This is the first note',
//       note_key_2: 'This is the second note'
//     }
//   };

//   try {
//     const response = await axios.post('https://api.razorpay.com/v1/contacts', contactData, {
//       auth: {
//         username: process.env.RAZORPAY_KEY_ID, // Your Razorpay API Key ID
//         password: process.env.RAZORPAY_KEY_SECRET // Your Razorpay API Key Secret
//       }
//     });
   
//     console.log('Contact created successfully:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating contact:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// //---------------------- Deactivate the contact -----------------------------------
// const deactivateContact = async (contactId) => {
//   try {
//     const response = await axios({
//       method: 'POST',
//       url: `https://api.razorpay.com/v1/contacts/${contactId}`,
//       auth: {
//         username: process.env.RAZORPAY_KEY_ID,  // Your Razorpay API Key ID
//         password: process.env.RAZORPAY_KEY_SECRET // Your Razorpay API Key Secret
//       },
//       data: {
//         active: false // Set the contact to inactive
//       }
//     });

//     console.log('Contact deactivated successfully:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error deactivating contact:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };


// // Function to create a customer on Razorpay
// const createCustomer = async (driver) => {
//   const customerData = {
//     name: driver.username,
//     email: driver.email,
//     contact: driver.phone,
//     notes: {
//       project_name: "Eber App"
//     }
//   };

//   try {
//     const response = await axios.post('https://api.razorpay.com/v1/customers', customerData, {
//       auth: {
//         username: process.env.RAZORPAY_KEY_ID,
//         password: process.env.RAZORPAY_KEY_SECRET,
//       },
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     // console.log(chalk.green("Customer Response Object: ", response))
      
//       const {id,entity,name,email,contact,notes} = response.data
    
//       const customer = new Customer({
//           name:name,
//           email:email ,
//           phone: contact,
//           razorpayCustomerId: id,
//           entity: entity,
//           notes: notes,
//        });
//       await customer.save();
//     // console.log(chalk.green("Customer saved Successfully: ", customer))
//     // console.log('Customer created successfully:', response.data);
//     return response.data.id; // Return the customer ID
//   } catch (error) {
//     console.error('Error creating customer:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };



// // Function to create a virtual account (customer identifier) with bank account receiver
// // const createVirtualAccount = async (customerId, virtualAccountDetails) => {
// //   console.log(chalk.bgWhite("customer: "))
// //   console.log(customerId)
    
// //     console.log(chalk.bgWhite("virtualAccountDetails: "))
// //     console.log(virtualAccountDetails)
// //   const virtualAccountData = {
// //     receivers: {
// //       types: ["bank_account"]
// //     },
// //     description: virtualAccountDetails.description, // Description for the virtual account
// //     customer_id: customerId, // Customer ID for which the virtual account is created
// //     close_by: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days from now
// //     notes: {
// //       project_name: virtualAccountDetails.project_name
// //     }
// //     };
 
    
// //     console.log(chalk.bgBlack("Virtual Account Data: "))
// //     console.log(virtualAccountData)
// //   try {
// //     // Make API call to Razorpay to create a virtual account
// //     const response = await axios.post('https://api.razorpay.com/v1/virtual_accounts', virtualAccountData, {
// //       auth: {
// //         username: process.env.RAZORPAY_KEY_ID,
// //         password: process.env.RAZORPAY_KEY_SECRET,
// //       },
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     });
// //       console.log(chalk.bgCyan("Response Object: "))
// //       console.log(response.data)
    
// //     // // // Create a new VirtualAccount instance and save it to MongoDB
// //     // const virtualAccount = new VirtualAccount({
// //     //   customerId: customerId, // Reference to the Customer's Object ID
// //     //   razorpayVirtualAccountId: response.data.id, // Use the ID returned from Razorpay
// //     //   description: response.data.description,
// //     //   receivers: response.data.receivers,
// //     //   closeBy: new Date(response.data.close_by * 1000), // Convert timestamp to date
// //     //   notes: response.data.notes
// //     // });
// //     //   console.log(chalk.bgCyan("Virtual Account: "))
// //     //   console.log(virtualAccount)
    
// //     // await virtualAccount.save(); // Save to MongoDB
// //     // console.log('Virtual account saved to MongoDB successfully:', virtualAccount);
// //     return response.data;

// //   } catch (error) {
     
// //    console.error("Error creating virtual account:", error.response ? error.response.data : error.message);
// //    throw error; // Re-throw the error after logging it
// //   }
// // };


// //=================== CREATE A FUND ACCOUNT ============================================


// const createFundAccount = async (driver, ifsc, account_type, account_number) => {
//   const fundAccountData = {
//     contact_id: driver.contactId,
//     account_type: account_type, // or 'vpa' for UPI
//     bank_account: {
//       name: driver.username,
//       ifsc: ifsc, // Example IFSC code
//       account_number: account_number, // Example account number
//     }
//   };

//   try {
//     const response = await axios.post('https://api.razorpay.com/v1/fund_accounts', fundAccountData, {
//       auth: {
//         username: process.env.RAZORPAY_KEY_ID,
//         password: process.env.RAZORPAY_KEY_SECRET,
//       }
//     });

//     console.log('Fund account created successfully:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating fund account:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// // Main function to handle the entire process
// const handleDriverPayoutSetup = async (driver, newFundAccount) => {
//     try {
//         // step 1: create a customer 
//     // await createCustomer(driver);
//     // Step 2: Create a virtual account (customer identifier)
//     // await createVirtualAccount(customer, virtualAccountDetails);
//     // Step 3: Create a fund account using the virtual account details
//     //  await createFundAccount(newFundAccount);

//     // console.log('Fund account linked to virtual account successfully:', fundAccount);
//     // return fundAccount;
//   } catch (error) {
//     console.error('Error setting up driver payout:', error.message);
//     throw error;
//   }
// };


    
// //===========================================================================================

// // Function to create a Razorpay payout

// const createRazorpayTransfer = async (driver, driverShare) => {
//   try {
//     const fundAccount = await Account.findOne({ driverObjectId: driver._id });
//     if (!fundAccount) {
//       throw new Error('Fund account not found!');
//     }

//     console.log('Fund Account:', fundAccount);

//     const transferParams = {
//         account: fundAccount.bank_account.account_number,
//         // fund_account_id: fundAccount.id,
//         amount: driverShare, // Amount in paise (e.g., 10000 paise = INR 100)
//         currency: "INR",
//         // notes: {
//         //     reference_id: `txn_${new Date().getTime()}`,
//         //     narration: "Payout for services"
//         // }
//     };

//     const response = await razorpayInstance.transfers.create(transferParams);

//     console.log('Transfer created successfully:', response);
//     return response;
//   } catch (error) {
//     console.error('Error creating transfer:', error);
//     throw error;
//   }
// };


// module.exports = { createContact, deactivateContact, createRazorpayTransfer,createFundAccount, createCustomer };
