const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentToken = require('../models/stripePayment'); // Adjust the path as necessary

const createNewPayment = async (req, res) => {
    
    const { token } = req.body;
    const cardLast4_digits =  req.body.card_last4
    const card = await PaymentToken.findOne({ cardLast4_digits });

    if (card.card_last4 === cardLast4_digits) {
       return res.status(402).send(null)
    }
  
    if (!token || !token.id) {
        return res.status(400).send({ error: 'Invalid token' });
    }

    try {
        const charge = await stripe.charges.create({
            amount: 5000, // Amount in cents
            currency: 'usd',
            source: token.id,
            description: 'Example charge'
        });

        const paymentToken = new PaymentToken({
            token_id: token.id,
            card_brand: token.card.brand,
            card_last4: token.card.last4,
            card_exp_month: token.card.exp_month,
            card_exp_year: token.card.exp_year,
            token_created: token.created,
            client_ip: token.client_ip
        });

        await paymentToken.save();

        res.status(200).send(charge);
    } catch (error) {
        console.error('Error creating charge:', error.message); // Log the error
        res.status(500).send({ error: error.message });
    }
};

module.exports = { createNewPayment };
