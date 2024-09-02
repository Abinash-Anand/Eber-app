require('dotenv')
const webpush = require('web-push');
const Subscription = require('../models/pushNotificationCreds');

// Configure VAPID keys
webpush.setVapidDetails(
  'mailto:abinashanand.elluminatiinc@gmail.com',
  process.env.WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
);

const handleSubscription = async (req, res) => {
    console.log("WEB_PUSH_PUBLIC_KEY , WEB_PUSH_PRIVATE_KEY", process.env.WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY)
  try {
    const subscription = req.body;
      const existingSubscription = await Subscription.findOne({ endpoint: subscription.endpoint });
      if (!existingSubscription) {
          res.status(404).send({message:"Not FOUND"})
        }
        if (existingSubscription) {
          console.log("existingSubscription: ", existingSubscription)
     existingSubscription.expirationTime = subscription.expirationTime;
      existingSubscription.keys = subscription.keys;
      await existingSubscription.save();
      return res.status(200).json({ message: 'Subscription updated successfully' });
      } else {
           // Create a new subscription entry in the database
    const newSubscription = new Subscription({
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: {
        p256dh:subscription.keys.p256dh,
        auth:   subscription.keys.auth
      }
    });

    await newSubscription.save();

}
   
    const payload = JSON.stringify({ title: 'Push Test', body: 'This is a test notification' });

  // Pass object into sendNotification
  webpush.sendNotification(subscription, payload).catch(error => console.error(error));
    // Send a response to the client
    res.status(201).json({ message: 'Subscription received and notification sent successfully.' });
  } catch (error) {
    console.error('Error handling subscription and notification:', error);

    // Send a single error response if headers haven't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to handle subscription and send notification' });
    }
  }
};

module.exports = { handleSubscription };
