require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');

// Set environment variables
const { CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET } = process.env;

// Function to authenticate and get an access token
const authenticateCashfree = async () => {
    console.log('Env: ',  CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET)
    try {
        const response = await axios.post(`https://payout-gamma.cashfree.com/payout/v1/authorize`, {}, {
            headers: {
                'X-Client-Id': CASHFREE_CLIENT_ID,
                'X-Client-Secret': CASHFREE_CLIENT_SECRET,
                'Content-Type': 'application/json'
            }
        });
        // const token = response.data.data.token;
        console.log('Authentication successful. Token:', response);
        return response; // Obtain the token from the response
    } catch (error) {
        console.error('Error authenticating with Cashfree:', error.response?.data || error.message || error);
        throw error;
    }
};

// Function to create a beneficiary
const createBeneficiary = async (token) => {
    try {
        const beneficiaryData = {
            beneficiary_id: 'john_doe_001',  
            beneficiary_name: 'John Doe',
            beneficiary_contact_details: {
                email: 'john.doe@example.com',
                phone: '9876543210',
            },
            beneficiary_instrument_details: {
                bankAccount: '1234567890',
                ifsc: 'HDFC0001234',
            },
            address1: '123 Baker Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        };

        const response = await axios.post(`https://sandbox.cashfree.com/payout/beneficiary`, beneficiaryData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-api-version': '2024-01-01'
            }
        });

        console.log('Beneficiary created successfully:', response.data);
    } catch (error) {
        console.error('Error creating beneficiary:', error.response?.data || error.message || error);
    }
};

// Function to initiate a payout
const initiatePayout = async (token) => {
    try {
        const payoutData = {
            transfer_id: 'UNIQUE_TXN_001',
            transfer_amount: 10.00,
            transfer_currency: 'INR',
            transfer_mode: 'banktransfer',
            beneficiary_details: {
                beneId: 'john_doe_001',
            },
            transfer_remarks: 'Salary payment for July',
        };

        const response = await axios.post(`https://sandbox.cashfree.com/payout/transfers`, payoutData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'x-api-version': '2024-01-01'
            }
        });

        console.log('Payout initiated successfully:', response.data);
    } catch (error) {
        console.error('Error initiating payout:', error.response?.data || error.message || error);
    }
};

// Main function to handle all three functions
const cashfreeMainFunction = async () => {
    try {
        const token = await authenticateCashfree();
        // await createBeneficiary(token);
        // await initiatePayout(token);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
};

module.exports = { cashfreeMainFunction };
