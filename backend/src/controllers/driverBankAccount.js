const FundAccount = require('../models/driverFundAccount');  // Make sure this path is correct based on your project structure
const Driver = require('../models/driverModel')
const { createFundAccount } = require('./razorpayGateway')
const mongoose = require('mongoose')
// Function to create and save driver bank account details in the database
const driverBankAccount = async (req, res) => {
    console.log("Req: ", req.body);
    
    try {
        // Step 1: Extract bank details from request body
        const { 
            account_type,
            ifsc,
            bank_name,
            account_number
        } = req.body;
        
        // Step 2: Validate the required fields
        if ( !account_type || !ifsc || !bank_name || !account_number) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        const driverId = req.params.id
        console.log("Driver ID: ", driverId)
        const driver = await Driver.findOne({ _id: driverId })
        console.log("Driver ID: ", driver)
        
        // Step 3: Create a new FundAccount entry
        const newFundAccount = new FundAccount({
            driverObjectId:driver._id,
            id: `fa_${new mongoose.Types.ObjectId()}`, // Generate a new unique ID for the fund account
            entity: 'fund_account',
            contact_id: driver.contactId,
            account_type: account_type,
            bank_account: {
                ifsc: ifsc,
                bank_name: bank_name,
                name: driver.username,
                account_number: account_number
            },
            batch_id: null, // Initially, batch_id can be null
            active: true, // Assuming the new account is active by default
            created_at: Math.floor(Date.now() / 1000) // Current time in seconds
        });
        console.log("Bank Object: ", newFundAccount);
        // Step 4: Save the new FundAccount entry to the database
        await newFundAccount.save();

        await createFundAccount(driver)

        // Step 5: Send success response
        res.status(201).send({ message: 'Driver bank account created successfully', fundAccount: newFundAccount });

    } catch (error) {
        // Step 6: Handle any errors that occurred
        console.error('Error creating driver bank account:', error);
        res.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
};
// const checkBankAccount = async (req, res) => {
//     try {
//         const 
//     } catch (error) {
        
//     }
// }
module.exports = { driverBankAccount };
