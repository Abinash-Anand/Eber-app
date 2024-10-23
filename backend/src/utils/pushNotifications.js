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
};

// Check if VAPID keys exist in the .env file
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

// If keys don't exist, generate them and save them to .env
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
}

// Configure web-push with VAPID details
webPush.setVapidDetails(
  'mailto:abinashanandab@gmail.com', // Replace with your email address
  vapidPublicKey,
  vapidPrivateKey
);

// Function to send push notifications using VAPID
const sendVapidPushNotification = (subscription, title, message) => {
    console.log("Subscription: ", subscription);

  const notificationPayload = JSON.stringify({
    title: title,
    body: message,
    // icon: '/path/to/icon.png', // Optional icon, replace with an actual path if needed
  });
console.log("SENDVAPID PUSH NOtification: ", notificationPayload)
  webPush.sendNotification(subscription, notificationPayload)
    .catch((error) => {
      console.error('Error sending push notification:', error);
    });
};

module.exports = { sendVapidPushNotification };
