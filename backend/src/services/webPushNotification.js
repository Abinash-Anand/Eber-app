require('dotenv')
const webpush = require('web-push')
   // VAPID keys
const vapidKeys = {
  publicKey: process.env.WEB_PUSH_PUBLIC_KEY,
  privateKey: process.env.WEB_PUSH_PRIVATE_KEY
};
webpush.setVapidDetails(
  'mailto:abinashanand.elluminatiinc@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// module.exports = {}