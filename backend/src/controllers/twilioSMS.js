// smsService.js or your equivalent file
require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSmsNotification = async (user, body) => {
  console.log("accountSid: ", accountSid)
  console.log("accountSid: ", authToken)

  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio phone number from environment variable
      to: `${user.countryCallingCode}${user.phone}`,  // Recipient's phone number
      body: body  // Message content
    });
    
    console.log(`Message sent: ${message.sid}`);
    return message;  // Return the message object for further handling
  } catch (error) {
    console.error('Error sending SMS:', error.message);  // Log the error message
    // Optionally, you can return the error or throw it if you want to handle it at a higher level
    throw new Error('Failed to send SMS notification');  // Custom error message for further handling
  }
};

const sendWhatsAppNotification = async (user, body) => {
  try {
    
    const message = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,  // Your Twilio WhatsApp number with 'whatsapp:' prefix
      to: `whatsapp:${user.countryCallingCode}${user.phone}`,  // Recipient's WhatsApp number with 'whatsapp:' prefix
      body: body  // Message content
    });

    console.log(`WhatsApp message sent: ${message.sid}`);
    return message;  // Return the message object if you want to use it further
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    // Optionally, throw an error or return it for further handling
    throw new Error('Failed to send WhatsApp notification');
  }
};

module.exports = { sendSmsNotification, sendWhatsAppNotification };
