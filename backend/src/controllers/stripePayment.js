const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentToken = require('../models/stripePayment'); // Adjust the path as necessary
const Booking = require('./bookedRidesController')
const Pricing = require('./pricingController')
const createNewPayment = async (req, res) => {
    const { token } = req.body;
    console.log(req.body);

    if (!token || !token.id) {
        return res.status(400).send({ error: 'Invalid token' });
    }

    try {
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

        res.status(200).send(paymentToken);
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error (code 11000 in MongoDB)
            return res.status(402).send({ error: 'Duplicate card entry detected' });
        }

        console.error('Error saving payment token:', error.message); // Log the error
        res.status(500).send({ error: error.message });
    }
};

const TranscationInitiation = async (booking)=>{
    // Check if the user has a payment token saved
      
        const paymentToken = await PaymentToken.findOne({ userId: user._id });
        if (!paymentToken) {
            return res.status(400).send({ error: 'No payment token found for this user' });
        }
        // Create a charge on the user's card
        const charge = await stripe.charges.create({
            amount: booking.totalFare , 
            currency: booking.country.currency,
            source: paymentToken.token_id,
            description: `Charge for trip ${booking.bookingId._id}`,
        });
        const pricing = await Pricing.findOne({country:booking.city._id})
        // Calculate the amount to transfer to the driver
        const driverShare = (booking.totalFare * (pricing.driverProfit/100)) * 100; // Example: 80% to the driver
        const platformFee = booking.totalFare * 0.2 * 100; // Example: 20% platform fee

      await transferReusable()

}

async function transferReusable() {
     // Transfer funds to the driver's Stripe account
        const transfer = await stripe.transfers.create({
            amount: driverShare,
            currency: 'usd',
            destination: driver.stripeAccountId, // The driver's connected Stripe account ID
            source_transaction: charge.id,
            description: `Payment for trip ${booking.bookingId._id}`,
        });
    
    return transfer;
}

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
module.exports = { createNewPayment , fetchUserCardDetails, TranscationInitiation};
