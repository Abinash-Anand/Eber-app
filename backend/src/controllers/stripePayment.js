const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentToken = require('../models/stripePayment'); // Adjust the path as necessary

const createNewPayment = async (req, res) => {
    const { token } = req.body;
    console.log(req.body);

    if (!token || !token.id) {
        return res.status(400).send({ error: 'Invalid token' });
    }

    try {
        // Attempt to create the charge
        const charge = await stripe.charges.create({
            amount: 5000, // Amount in cents
            currency: 'usd',
            source: token.id,
            description: 'Example charge'
        });

        // Create a new PaymentToken instance
        const paymentToken = new PaymentToken({
            token_id: token.id,
            userId: token.userId,
            card_brand: token.card.brand,
            card_last4: token.card.last4,
            card_exp_month: token.card.exp_month,
            card_exp_year: token.card.exp_year,
            token_created: token.created,
            client_ip: token.client_ip
        });

        // Attempt to save the new payment token
        await paymentToken.save();

        res.status(200).send(charge);
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error (code 11000 in MongoDB)
            return res.status(402).send({ error: 'Duplicate card entry detected' });
        }

        console.error('Error creating charge:', error.message); // Log the error
        res.status(500).send({ error: error.message });
    }
};



const fetchUserCardDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(req.params.id);
    const cards = await PaymentToken.find({userId})//---expect an object as argument
    if (!cards) {
        return res.status(404).send(cards);
    }
    res.status(201).send(cards);
    
    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = { createNewPayment , fetchUserCardDetails};
