const FundAccount = require('../models/FundAccount');  // Make sure this path is correct based on your project structure
const Driver = require('../models/driverModel')
// Function to create and save driver bank account details in the database
const driverBankAccount = async (req, res) => {
    try {
        // Step 1: Extract bank details from request body
        const { 
            contact_id,
            account_type,
            ifsc,
            bank_name,
            name,
            account_number
        } = req.body;

        // Step 2: Validate the required fields
        if (!contact_id || !account_type || !ifsc || !bank_name || !name || !account_number) {
            return res.status(400).send({ error: 'All fields are required' });
        }
        const driverId = req.params.id
        const driver = await findOne({_id:driverId})
        // Step 3: Create a new FundAccount entry
        const newFundAccount = new FundAccount({
            driverObjectId:driver._id,
            id: `fa_${new mongoose.Types.ObjectId()}`, // Generate a new unique ID for the fund account
            entity: 'fund_account',
            contact_id: contact_id,
            account_type: account_type,
            bank_account: {
                ifsc: ifsc,
                bank_name: bank_name,
                name: name,
                account_number: account_number
            },
            batch_id: null, // Initially, batch_id can be null
            active: true, // Assuming the new account is active by default
            created_at: Math.floor(Date.now() / 1000) // Current time in seconds
        });

        // Step 4: Save the new FundAccount entry to the database
        await newFundAccount.save();

        // Step 5: Send success response
        res.status(201).send({ message: 'Driver bank account created successfully', fundAccount: newFundAccount });

    } catch (error) {
        // Step 6: Handle any errors that occurred
        console.error('Error creating driver bank account:', error);
        res.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = { driverBankAccount };
