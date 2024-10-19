const StripeSettings = require('../models/stripeSettings'); // Adjust path as necessary

// Get Stripe Settings
const getStripeSettings = async (req, res) => {
  try {
    const settings = await StripeSettings.findOne(); // Find the first settings document
    if (!settings) {
      return res.status(404).json({ message: 'Stripe settings not found' });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching Stripe settings:', error.message);
    res.status(500).json({ message: 'Server error. Could not fetch Stripe settings.' });
  }
};

// Update Stripe Settings
const updateStripeSettings = async (req, res) => {
  const { stripeSecretKey, defaultCurrency, driverPayoutFrequency, stripeMode } = req.body;

  try {
    // Find the existing settings or create new if not found
    let settings = await StripeSettings.findOne();
    if (!settings) {
      // Create new Stripe settings if not found
      settings = new StripeSettings({
        stripeSecretKey,
        defaultCurrency,
        driverPayoutFrequency,
        stripeMode,
      });
    } else {
      // Update the existing settings with new values
      settings.stripeSecretKey = stripeSecretKey;
      settings.defaultCurrency = defaultCurrency;
      settings.driverPayoutFrequency = driverPayoutFrequency;
      settings.stripeMode = stripeMode;
    }

    // Save the settings in the database
    await settings.save();

    res.status(200).json({
      message: 'Stripe settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating Stripe settings:', error.message);
    res.status(500).json({ message: 'Server error. Could not update Stripe settings.' });
  }
};

// Delete Stripe Settings (Optional if required)
const deleteStripeSettings = async (req, res) => {
  try {
    const settings = await StripeSettings.findOneAndDelete(); // Delete the settings document
    if (!settings) {
      return res.status(404).json({ message: 'Stripe settings not found' });
    }
    res.status(200).json({ message: 'Stripe settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting Stripe settings:', error.message);
    res.status(500).json({ message: 'Server error. Could not delete Stripe settings.' });
  }
};

module.exports = { getStripeSettings, updateStripeSettings, deleteStripeSettings };
