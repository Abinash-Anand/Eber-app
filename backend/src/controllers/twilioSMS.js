// smsService.js or your equivalent file

require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSmsNotification = async(user, body) => {
  return client.messages
    .create({
      from: '+19012311194', // Your Twilio phone number
      to: (user.countryCallingCode+user.phone), // Recipient's phone number
      body: body // Message content
    })
    .then(message => console.log(`Message sent: ${message.sid}`))
    .catch(error => console.error('Error sending SMS:', error));
};

module.exports = { sendSmsNotification };
