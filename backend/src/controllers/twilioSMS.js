require('dotenv').config();
const twilio = require('twilio');
const TwilioSettings = require('../models/twilioSettings'); // Make sure this path matches your project structure

// Function to fetch Twilio settings from MongoDB
const getTwilioSettings = async () => {
  try {
    const settings = await TwilioSettings.findOne().sort({ createdAt: -1 }).exec();
    if (!settings) {
      throw new Error('No Twilio settings found');
    }
    return settings;
  } catch (error) {
    console.error('Error fetching Twilio settings:', error);
    throw error;
  }
};

// Function to create Twilio client dynamically based on latest settings
const createTwilioClient = async () => {
  const settings = await getTwilioSettings();
  return twilio(settings.accountSid, settings.authToken);
};

// Function to send an SMS notification
const sendSmsNotification = async (user, body) => {
  try {
    const settings = await getTwilioSettings();
    const client = await createTwilioClient();

    const message = await client.messages.create({
      from: settings.twilioPhoneNumber,  // Use Twilio phone number from settings
      to: `${user.countryCallingCode}${user.phone}`,  // Recipient's phone number
      body: body || settings.defaultMessage,  // Use provided body or default message
    });

    console.log(`SMS message sent: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    throw new Error('Failed to send SMS notification');
  }
};

// Function to send a WhatsApp notification
const sendWhatsAppNotification = async (user, body) => {
  try {
    const settings = await getTwilioSettings();
    const client = await createTwilioClient();

    const message = await client.messages.create({
      from: `whatsapp:${settings.whatsappNumber}`,  // Use WhatsApp number from settings with 'whatsapp:' prefix
      to: `whatsapp:${user.countryCallingCode}${user.phone}`,  // Recipient's WhatsApp number with 'whatsapp:' prefix
      body: body || settings.whatsappMessage,  // Use provided body or default WhatsApp message
    });

    console.log(`WhatsApp message sent: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    throw new Error('Failed to send WhatsApp notification');
  }
};

// // Optional: function to test Twilio configuration immediately after saving new settings
// const testTwilioConfiguration = async () => {
//   try {
//     const settings = await getTwilioSettings();
//     const client = await createTwilioClient();

//     const message = await client.messages.create({
//       from: settings.twilioPhoneNumber,
//       to: settings.twilioPhoneNumber, // Sending to the Twilio number itself for testing
//       body: 'This is a test message to verify Twilio configuration.',
//     });

//     console.log(`Test SMS sent successfully: ${message.sid}`);
//   } catch (error) {
//     console.error('Failed to send test SMS:', error.message);
//     throw new Error('Test SMS failed');
//   }
// };
// Controller function to save Twilio settings
const saveTwilioSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    const twilioSettings = new TwilioSettings(settingsData);
    await twilioSettings.save();
    
    // Test sending an SMS immediately after saving the settings
    // await testTwilioClient(settingsData);
    
    res.status(200).json({ message: 'Twilio settings saved and test message sent successfully!' });
  } catch (error) {
    console.error("Error saving Twilio settings or sending test message:", error);
    res.status(500).json({ message: 'Error saving Twilio settings or sending test message', error });
  }
};
module.exports = { sendSmsNotification, sendWhatsAppNotification, saveTwilioSettings };
