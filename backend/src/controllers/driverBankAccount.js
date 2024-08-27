// const FundAccount = require('../models/driverFundAccount');  // Make sure this path is correct based on your project structure
// const { createFundAccount , createCustomer} = require('./razorpayGateway')
// const {createOmiseRecipient} = require('./omisePaymentGateway')
const Driver = require('../models/driverModel')
const mongoose = require('mongoose')
const RecipientOmise = require('../models/omiseAccount')
const {cashfreeMainFunction} = require('./cashfreePaymentGateway')




// Function to create and save driver bank account details in the database
const driverBankAccount = async (req, res) => {
    // console.log("Req: ", req.body);
    
    try {
       
        // Step 1: Extract bank details from request body
        const {bank_name, account_number } = req.body;
        // console.log("bank object: ", account_number);
        
        // Step 2: Validate the required fields
        if (!bank_name || !account_number) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        const driverId = req.params.id
        // console.log("Driver ID: ", driverId)
        const driver = await Driver.findOne({ _id: driverId })
        // console.log("OMISE ACCOUNT: ", omiseAccount);
        // await cashfreeMainFunction()
        // console.log("Driver ID: ", driver)
        // const customerId = await createCustomer(driver)
        // const omiseAccount = await createOmiseRecipient();
        // Step 3: Create a new FundAccount entry
        // [,,omiseRecipientId,driverObjectId]
        // const omiseRecipient =  await omiseMainFunction(driver, bank_name, account_number)
        // const newRecipient = new RecipientOmise({
        //     accountHolderName:driver.username,
        //     accountHolderEmail:driver.email,
        //     bank_account: {
            //         bank_name,
            //         account_number,
            //         accountHolderName:driver.username
        //     },
        //     omiseRecipientId:omiseRecipientId,
        //     driverObjectId:driver._id,

        // });
        // console.log("Bank Object: ", omiseRecipient);
        // Step 4: Save the new FundAccount entry to the database
        // await newRecipient.save();
        // await createFundAccount(driver, ifsc, account_type, account_number)
        

        // Step 5: Send success response
        // res.status(201).send({ message: 'Driver bank account created successfully', fundAccount: newFundAccount });

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