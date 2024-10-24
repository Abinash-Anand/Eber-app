const webPush = require('web-push');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Function to save VAPID keys to the .env file
const saveVapidKeysToEnv = (publicKey, privateKey) => {
  const envPath = path.resolve(__dirname, '../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');

  envContent = envContent.replace(/^VAPID_PUBLIC_KEY=.*/m, `VAPID_PUBLIC_KEY=${publicKey}`);
  envContent = envContent.replace(/^VAPID_PRIVATE_KEY=.*/m, `VAPID_PRIVATE_KEY=${privateKey}`);

  fs.writeFileSync(envPath, envContent);
  console.log('VAPID keys saved to .env file');
};

// Check if VAPID keys exist in the .env file
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  console.log('VAPID keys not found in .env. Generating new keys...');
  const vapidKeys = webPush.generateVAPIDKeys();
  vapidPublicKey = vapidKeys.publicKey;
  vapidPrivateKey = vapidKeys.privateKey;

  // Save the newly generated keys to the .env file
  saveVapidKeysToEnv(vapidPublicKey, vapidPrivateKey);

  console.log('VAPID keys generated and saved to .env:');
  console.log('Public Key:', vapidPublicKey);
  console.log('Private Key:', vapidPrivateKey);
} else {
  console.log('VAPID keys loaded from .env:');
  console.log('Public Key:', vapidPublicKey);
  console.log('Private Key:', vapidPrivateKey);
}

// Configure web-push with VAPID details
webPush.setVapidDetails(
  'mailto:abinashanandab@gmail.com', // Replace with your email address
  vapidPublicKey,
  vapidPrivateKey
);
console.log('Web-push VAPID details set');

// Function to send push notifications using VAPID
const sendVapidPushNotification = (subscription, title, message) => {
  if (!subscription) {
    console.error('No subscription provided');
    return;
  }

  console.log("Subscription object: ", JSON.stringify(subscription));

  const notificationPayload = JSON.stringify({
    title: title,
    body: message,
    // icon: '/path/to/icon.png', // Optional icon, replace with an actual path if needed
  });

  console.log("Notification Payload to send: ", notificationPayload);

  webPush.sendNotification(subscription, notificationPayload)
    .then(response => {
      console.log('Push notification sent successfully:', response);
    })
    .catch((error) => {
      console.error('Error sending push notification:', error);
    });
};

module.exports = { sendVapidPushNotification };
