require('dotenv').config();  // Load environment variables

const omise = require('omise')({
    secretKey: process.env.OMISE_SECRET_KEY,
});

const createOmiseRecipient = async () => {
    try {
        console.log("ENV: ", process.env.OMISE_SECRET_KEY);
        
        const recipient = await omise.recipients.create({
            name: 'John Doe', // Test name
            email: 'john.doe@example.com', // Test email
            type: 'individual', // Type of recipient (individual or corporation)
            bank_account: {
                brand: 'bbl', // Bangkok Bank (use 'bbl' for testing Thailand banks)
                number: '1234567890', // Test bank account number (Omise does not validate the number format for testing)
                name: 'John Doe', // Test bank account holder's name
            },
        });

        console.log('Recipient created:', recipient);
        return recipient;

    } catch (error) {
        console.log('Error creating recipient:', error);
        return null;
    }
};

module.exports = { createOmiseRecipient };
