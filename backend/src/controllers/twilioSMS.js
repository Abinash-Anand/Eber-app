// smsService.js or your equivalent file

require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSmsNotification = async(user, body) => {
  return client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: (user.countryCallingCode+user.phone), // Recipient's phone number
      body: body // Message content
    })
    .then(message => console.log(`Message sent: ${message.sid}`))
    .catch(error => console.error('Error sending SMS:', error));
};
const sendWhatsAppNotification = async (user, body) => {
  try {
    const message = await client.messages.create({
      from:`whatsapp:${( process.env.TWILIO_WHATSAPP_NUMBER)}`, // 'whatsapp:+14155238886' or your Twilio WhatsApp number
      to: `whatsapp:${(user.countryCallingCode+user.phone)}`, // Recipient's WhatsApp number with 'whatsapp:' prefix
      body: body // Message content
    });

    console.log(`WhatsApp message sent: ${message.sid}`);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
};
module.exports = { sendSmsNotification, sendWhatsAppNotification };
