
const Subscription = require('../models/pushNotification'); // Import the subscription model
const userModel = require('../models/usersModel');

// Route to save subscription

const saveSubscription =  async (req, res) => {
    console.log("SUb: ", req.body)
    try {
      const subscription  = req.body;  // Assuming `userId` and `subscription` are passed from the frontend
        
        // Check if a subscription already exists for this user and endpoint
    const existingSubscription = await Subscription.findOne({
      endpoint: subscription.endpoint
    });

    if (!existingSubscription) {
      // Create a new subscription
      const newSubscription = new Subscription({
        endpoint: subscription.endpoint,
        keys: subscription.keys
      });

      await newSubscription.save();
      console.log('Subscription saved:', newSubscription);
    } else {
      console.log('Subscription already exists for this user and endpoint.');
    }

    res.status(200).json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
};


module.exports = {saveSubscription};
