// controllers/stripePayment.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentMethod = require('../models/stripePayment'); // Adjust the path as necessary
const Booking = require('../models/rideBookings'); // Adjust the path as necessary
const Pricing = require('../models/pricingModel');
const CustomAccount = require('../models/stripeDriverAccount');
const driverModel = require('../models/driverModel');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const User = require('../models/usersModel')

//============================== createNewPayment ===========================

const createNewPayment = async (req, res) => {
  const { paymentMethod } = req.body; // Payment method data from request body

  if (!paymentMethod || !paymentMethod.id) {
    return res.status(400).send({ error: 'Invalid payment method' });
  }

  // Capture the client's IP address from the request object
  const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // Check if a payment method with the same payment_method_id already exists for this user
    const existingPaymentMethod = await PaymentMethod.findOne({
      payment_method_id: paymentMethod.id,
      userId: paymentMethod.userId,
    });

    let customer; // Variable to store the customer object

    // Check if customer exists or needs to be created
    if (!existingPaymentMethod || !existingPaymentMethod.stripeCustomerId) {
      // Check if customer already exists by email
      let customerList = await stripe.customers.list({
        email: req.body.email, // Use email from the request body, if available
        limit: 1,
      });

      if (customerList.data.length === 0) {
        // Create a new customer if none exists
        customer = await stripe.customers.create({
          email: req.body.email,
        });
      } else {
        customer = customerList.data[0];
      }

      if (existingPaymentMethod) {
        // Update existing payment method with the new customer ID and payment method ID
        existingPaymentMethod.stripeCustomerId = customer.id;
        existingPaymentMethod.payment_method_id = paymentMethod.id;
        existingPaymentMethod.client_ip = client_ip;
        await existingPaymentMethod.save();
      } else {
        // Attach the PaymentMethod to the new customer
        await stripe.paymentMethods.attach(paymentMethod.id, {
          customer: customer.id,
        });

        // Optionally, set the payment method as the default
        await stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: paymentMethod.id,
          },
        });

        // Create and save a new payment method document in MongoDB
        const newPaymentMethod = new PaymentMethod({
          payment_method_id: paymentMethod.id,
          userId: paymentMethod.userId,
          stripeCustomerId: customer.id, // Save the Stripe customer ID
          card_brand: paymentMethod.card.brand,
          card_last4: paymentMethod.card.last4,
          card_exp_month: paymentMethod.card.exp_month,
          card_exp_year: paymentMethod.card.exp_year,
          client_ip: client_ip,
          defaultCard: true, // Set as default if it's the first card
        });

        console.log("New Payment Method: ", newPaymentMethod);
        await newPaymentMethod.save();
        return res.status(201).send(newPaymentMethod);
      }

      return res.status(200).send(existingPaymentMethod);
    } else {
      // If the payment method exists, attach it to the existing customer
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: existingPaymentMethod.stripeCustomerId,
      });

      // Optionally, set the payment method as the default
      await stripe.customers.update(existingPaymentMethod.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });

      // Update existing payment method details in MongoDB
      existingPaymentMethod.payment_method_id = paymentMethod.id;
      existingPaymentMethod.client_ip = client_ip;
      existingPaymentMethod.defaultCard = true; // Set as default
      await existingPaymentMethod.save();

      // Optionally, unset other cards as default
      await PaymentMethod.updateMany(
        { userId: paymentMethod.userId, _id: { $ne: existingPaymentMethod._id } },
        { defaultCard: false }
      );

      return res.status(200).send(existingPaymentMethod);
    }

  } catch (error) {
    console.error('Error saving payment method:', error.message);
    return res.status(500).send({ error: error.message });
  }
};

//============================== TransactionInitiation ===========================
// Helper function to check available balance
const checkAvailableBalance = async (currency) => {
  try {
    const balance = await stripe.balance.retrieve();
    const availableBalance = balance.available.find(b => b.currency === currency);

    if (availableBalance) {
      console.log(`Available balance in ${currency}:`, availableBalance.amount);
      return availableBalance.amount;
    } else {
      return 0; // No available balance in this currency
    }
  } catch (error) {
    console.error('Error checking available balance:', error.message);
    throw error;
  }
};

// Helper function to add funds to the account (Test mode only)
// Helper function to add funds to the account (Test mode only
const addFundsToBalance = async (currency, amount) => {
  try {
    // Adding the correct amount (INR in this case)
    const charge = await stripe.charges.create({
      amount: amount * 100, // Ensure this is the correct amount in the smallest currency unit
      currency: currency, // Should be 'inr' for INR
      source: 'tok_bypassPending', // Test token for adding funds to balance (may not work in INR)
      description: `Test charge to add ${amount / 100} ${currency.toUpperCase()} to available balance`,
    });
    console.log(`Added ${(charge.amount).toFixed(2)} ${currency.toUpperCase()} to available balance.`);
    return charge;
  } catch (error) {
    console.error('Error adding funds to balance:', error.message);
    throw error;
  }
};


// Main transaction initiation function
const TransactionInitiation = async (booking) => {
  console.log("Booking: ", booking);
  try {
    // Fetch the payment method and ensure it includes the customer ID
    const paymentMethod = await PaymentMethod.findOne({ userId: booking.userId._id, defaultCard: true });

    if (!paymentMethod) {
      return { error: 'No payment method found for this user' };
    }

    // Use the Stripe customer ID stored in the payment method document
    const customerId = paymentMethod.stripeCustomerId; 

    if (typeof customerId !== 'string' || !customerId.trim()) {
      throw new Error('Customer ID must be a valid non-empty string.');
    }

    // Find the user and their currency
    const user = await User.findOne({ _id: booking.userId._id }).populate('countryObjectId');
    if (!user) {
      throw new Error("User not found");
    }

    const totalFare = Math.round(booking.bookingId.totalFare * 100); // Total fare in the smallest currency unit
    const currency = user.countryObjectId.currency;

    console.log(`Total fare: ${totalFare} ${currency.toUpperCase()}`);

    // Step 1: Check the available balance in the appropriate currency
    let availableBalance = await checkAvailableBalance(currency);

    // Step 2: Compare available balance with totalFare
    if (availableBalance < totalFare) {
      console.log(`Insufficient funds. Adding ${totalFare - availableBalance} ${currency.toUpperCase()} to the balance...`);

      // Step 3: Add funds in the correct currency to cover the difference
      await addFundsToBalance(currency, totalFare - availableBalance);

      // Step 4: Re-check the balance after adding funds
      availableBalance = await checkAvailableBalance(currency);

      // Check if balance is still insufficient after adding funds
      if (availableBalance < totalFare) {
        throw new Error(`Insufficient funds even after adding balance. Available: ${availableBalance}, Required: ${totalFare}`);
      }
    }

    // Step 5: Proceed with creating a Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalFare, // Amount in the smallest currency unit
      currency: currency,
      payment_method: paymentMethod.payment_method_id,
      customer: customerId,
      confirm: true,
      return_url: 'http://localhost:4200/rides/confirm-ride',
      description: `Charge for trip ${booking.bookingId._id}`,
    });
    console.log("Payment intent: ", paymentIntent);

    if (paymentIntent.status === 'succeeded') {
      const pricing = await Pricing.findOne({ city: booking.city._id });
      if (!pricing) {
        console.error('Pricing Data not found');
        throw new Error('Pricing data not found');
      }

      // Transfer to driver's account
      const driverAccount = await CustomAccount.findOne({ driverObjectId: booking.driverObjectId._id });
      if (!driverAccount) {
        throw new Error('Driver Account not found');
      }

      if (paymentIntent.id && driverAccount.stripe_account_id) {
        await TransferToDriver(paymentIntent, booking, user);
      } else {
        throw new Error("Driver does not have a Custom stripe account!");
      }

      return paymentIntent;
    } else {
      throw new Error('Payment Intent was not successful');
    }
  } catch (error) {
    console.error('Error during transaction initiation:', error.message);
    throw error;
  }
};
//============================== fetchUserCardDetails ===========================

const fetchUserCardDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`Fetching cards for User ID: ${userId}`);
    const cards = await PaymentMethod.find({ userId }); // Expect an object as an argument
    if (!cards || cards.length === 0) {
      return res.status(404).send({ error: 'No cards found for this user' });
    }
    res.status(200).send(cards);
  } catch (error) {
    console.error('Error fetching card details:', error.message);
    res.status(500).send({ error: error.message });
  }
};

//===============================CREATING A CUSTOM ACCOUNT===================================

const stripeCustomConnectedAccount = async (req, res) => {
  try {
    const driverId = req.params.id;

    if (!driverId) {
      return res.status(400).send({ error: "Driver ID is required in params." });
    }

    const {
      city,
      country,
      dob_day,
      dob_month,
      dob_year,
      email,
      first_name,
      last_name,
      line1,
      phone,
      postal_code,
      state,
      type,
      business_url, // Ensure this is sent from the client or set a default
    } = req.body;

    // Corrected Validation: Use logical OR (||) between each condition
    if (
      !city ||
      !country ||
      !dob_day ||
      !dob_month ||
      !dob_year ||
      !email ||
      !first_name ||
      !last_name ||
      !line1 ||
      !phone ||
      !postal_code ||
      !state ||
      !type ||
      !business_url
    ) {
      return res.status(400).send({ error: "All required fields must be provided." });
    }

    // Fetch the driver from the database
    const driver = await driverModel.findOne({ _id: driverId });
    if (!driver) {
      return res.status(404).send({ error: "Driver not found." });
    }

    // Create Stripe Account
    const account = await stripe.accounts.create({
      country: country, // Germany country code 'DE'
      type: 'custom', // Fixed to 'custom' as per your schema
      business_type: 'individual', // Assuming drivers are individuals
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      individual: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        dob: {
          day: dob_day,
          month: dob_month,
          year: dob_year,
        },
        address: {
          line1: line1,
          city: city,
          postal_code: postal_code,
          state: state,
          country: country,
        },
      },
      business_profile: {
        url: business_url, // Ensure this is provided by the client
      },
    });
    console.log("Account creation response: ", account);

    // Create CustomAccount Document in MongoDB
    const customAccount = new CustomAccount({
      stripe_account_id: account.id, // Save Stripe Account ID
      driverObjectId: driver._id,
      email: email,
      country: country,
      type: type,
      business_type: 'individual', // As set during Stripe account creation
      individual: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        dob: {
          day: dob_day,
          month: dob_month,
          year: dob_year,
        },
        address: {
          line1: line1,
          city: city,
          postal_code: postal_code,
          state: state,
          country: country,
        },
      },
      business_profile: {
        url: business_url,
      },
      // Optional fields can remain as defaults or empty
    });

    await customAccount.save();

    // Optionally, associate the CustomAccount with the Driver
    // driver.customAccount = customAccount._id;
    // await driver.save();

    res.status(201).send({ account, customAccount });
  } catch (error) {
    console.error('Error creating driver Stripe account:', error);

    // Enhanced error response
    if (error.type === 'StripeCardError') {
      // Handle Stripe specific errors
      res.status(400).send({ error: error.message });
    } else {
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
};

//============================== updateStripeAccount ===========================

const updateStripeAccount = async (req, res) => {
  try {
    const driverId = req.params.id;

    // Validate the presence of driverId
    if (!driverId) {
      console.error("Driver ID is missing in params.");
      return res.status(400).json({ error: "Driver ID is required in params." });
    }

    // Find the CustomAccount associated with the driver
    const driverAccount = await CustomAccount.findOne({ driverObjectId: driverId }).populate('driverObjectId').populate('countryObjectId');
    if (!driverAccount) {
      console.error(`Driver account not found for driverId: ${driverId}`);
      return res.status(404).json({ error: "Driver account not found." });
    }

    // Extract optional data from req.body
    const {
      accept_tos,               // Boolean
      account_holder_name,     // String
      account_holder_type,     // 'individual' or 'company'
      account_number,          // String (valid IBAN)
      business_mcc,            // String (Merchant Category Code)
      card_capabilities,       // Boolean
      country,                 // 'DE' (Germany)
      // Additional optional fields can be added here
    } = req.body;

    // Validate required fields for update
    if (
      accept_tos === undefined ||
      !account_holder_name ||
      !account_holder_type ||
      !account_number ||
      !business_mcc ||
      card_capabilities === undefined ||
      !country
    ) {
      console.error("Missing required fields in request body.");
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // 1. Update Business Profile MCC in Stripe
    const businessProfile = await stripe.accounts.update(driverAccount.stripe_account_id, {
      business_profile: {
        mcc: business_mcc,  // Example MCC for transportation services
      },
    });
    console.log('Step 1: Business Profile MCC updated', businessProfile.business_profile);

    // 2. Add an External Account (Bank Account) to Stripe
    const externalAccount = await stripe.accounts.createExternalAccount(driverAccount.stripe_account_id, {
      external_account: {
        object: 'bank_account',
        country: country,                  // Germany
        currency: driverAccount.driverObjectId.countryObjectId.currency,                   // EUR is the currency in Germany
        account_holder_name: account_holder_name,  // Provided account holder name
        account_holder_type: account_holder_type,  // Type of account holder
        account_number: account_number,            // Valid IBAN
        // Do not include BIC; Stripe derives it from the IBAN
      },
    });
    console.log('Step 2: External account (Bank Account) added', externalAccount);

    // 3. Accept the Terms of Service in Stripe
    if (!accept_tos) {
      console.error("Terms of Service not accepted.");
      return res.status(400).json({ error: "You must accept the Terms & Conditions." });
    }

    const termsOfService = await stripe.accounts.update(driverAccount.stripe_account_id, {
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),  // Current timestamp
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '192.168.1.1', // Replace with actual IP
        // Optionally, include user_agent if available
      },
    });
    console.log('Step 3: Terms of Service accepted', termsOfService.tos_acceptance);

    // 4. Request Card Payment and Transfer Capabilities in Stripe
    const cardCapabilitiesResponse = await stripe.accounts.update(driverAccount.stripe_account_id, {
      capabilities: {
        card_payments: { requested: card_capabilities },
        transfers: { requested: card_capabilities },
      },
    });
    console.log('Step 4: Card Payment and Transfer capabilities requested', cardCapabilitiesResponse.capabilities);

    // 5. Check for any remaining requirements in Stripe
    const account = await stripe.accounts.retrieve(driverAccount.stripe_account_id);
    const remainingRequirements = account.requirements.currently_due;
    console.log('Step 5: Remaining requirements checked', remainingRequirements);

    // 6. Prepare Update Data for MongoDB
    const updateData = {
      business_profile: {
        mcc: business_mcc,
      },
      external_account: {
        object: 'bank_account', // Assuming it's a bank account
        country: country,
        currency: 'eur', // As per Stripe account settings
        account_holder_name: account_holder_name,
        account_holder_type: account_holder_type,
        account_number: account_number,
      },
      capabilities: {
        card_payments: { requested: card_capabilities },
        transfers: { requested: card_capabilities },
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '192.168.1.1',
      },
    };

    // 7. Update MongoDB Document with Optional Data
    const updatedCustomAccount = await CustomAccount.findOneAndUpdate(
      { driverObjectId: driverId },
      { $set: updateData },
      { new: true } // Return the updated document
    );
    console.log('MongoDB: CustomAccount updated with optional data', updatedCustomAccount);

    // 8. Send back the remaining requirements or success message
    if (Array.isArray(remainingRequirements) && remainingRequirements.length > 0) {
      console.log("Sending response with remaining requirements.");
      return res.status(200).json({
        message: 'Account updated but has remaining requirements',
        remaining_requirements: remainingRequirements,
      });
    } else {
      console.log("Sending success response.");
      return res.status(200).json({
        message: 'Account updated successfully and card capabilities activated',
      });
    }
  } catch (error) {
    console.error('Error updating Stripe account:', error);

    // Enhanced error response
    if (error.type === 'StripeCardError') {
      // Handle Stripe specific errors
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

//================================= Transfer Payment to the driver =================
const TransferToDriver = async (paymentIntent, booking, user) => {
  try {
    // Fetch pricing data to determine driver share
    const pricing = await Pricing.findOne({ city: booking.city._id });
    if (!pricing) {
      throw new Error('Pricing data not found');
    }

    // Calculate the driver's share based on the total payment amount
    const driverShare = Math.round(paymentIntent.amount * (pricing.driverProfit / 100));

    // Ensure that the driver has a Stripe Custom account ID
    if (!booking.driverObjectId || !booking.driverObjectId._id) {
      throw new Error('Driver Object ID not found in the booking');
    }

    console.log('Driver object ID:', booking.driverObjectId._id);

    // Find the driver's custom Stripe account
    const driverCustomAccount = await CustomAccount.findOne({ driverObjectId: booking.driverObjectId._id });

    if (!driverCustomAccount) {
      console.error("No custom account found for driver:", booking.driverObjectId._id);
      throw new Error('Driver Account not found');
    }

    console.log("Driver custom account:", driverCustomAccount);

    if (!driverCustomAccount.stripe_account_id) {
      console.error("Driver Stripe account ID is missing in the CustomAccount document for driver:", booking.driverObjectId._id);
      throw new Error('Driver Stripe account ID not found');
    }

    // Create the transfer to the driver's Stripe Custom account
    const transfer = await stripe.transfers.create({
      amount: driverShare, // Amount in smallest currency unit
      currency: user.countryObjectId.currency,     // Currency must match the currency used in the payment
      destination: driverCustomAccount.stripe_account_id, // Driver's Stripe account ID
      transfer_group: paymentIntent.id, 
      description: `Driver share for trip ${booking.bookingId._id}`, 
    });

    console.log('Transfer to driver successful: ', transfer);
    return transfer;

  } catch (error) {
    console.error('Error during transfer to driver:', error.message);
    console.error(error.stack); // Log the stack trace for debugging
    throw error;
  }
};



const checkBalance = async () => {
  try {
    const balance = await stripe.balance.retrieve();

    // Log the available balance
    console.log('Available balance:', balance.available);
    console.log('Pending balance:', balance.pending);
  } catch (error) {
    console.error('Error retrieving balance:', error.message);
  }
};
checkBalance()

// const addFundsToBalance = async () => {
//   try {
//     const charge = await stripe.charges.create({
//       amount: 5000, // Amount in cents (e.g., 5000 = $50.00)
//       currency: 'usd',
//       source: 'tok_bypassPending', // Special test token to bypass pending state
//       description: 'Test charge to add funds to available balance',
//     });

//     console.log('Funds added to balance:', charge);
//   } catch (error) {
//     console.error('Error adding funds to balance:', error.message);
//   }
// };




//============================== handleStripeWebhook ===========================
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log(`Webhook received: ${event.type}`);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update booking status, notify user, etc.
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      // Notify user of failure, log the error, etc.
      await handlePaymentIntentFailed(failedPaymentIntent);
      break;
    case 'account.updated':
      const account = event.data.object;
      // Update your database with the latest account information
      await handleAccountUpdated(account);
      break;
    // Add more cases as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

//============================== Webhook Event Handlers ===========================

const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    console.log(`Handling payment_intent.succeeded for PaymentIntent ID: ${paymentIntent.id}`);

    // Find the booking associated with this payment intent
    const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
    if (booking) {
      booking.status = 'paid';
      await booking.save();
      console.log(`Booking ${booking._id} marked as paid.`);

      // Optionally, notify the user and driver via Socket.io or email
      // Example:
      // io.emit('payment-success', { bookingId: booking._id });
    } else {
      console.warn(`No booking found for PaymentIntent ID: ${paymentIntent.id}`);
    }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error.message);
  }
};

const handlePaymentIntentFailed = async (failedPaymentIntent) => {
  try {
    console.log(`Handling payment_intent.payment_failed for PaymentIntent ID: ${failedPaymentIntent.id}`);

    // Find the booking associated with this payment intent
    const booking = await Booking.findOne({ paymentIntentId: failedPaymentIntent.id });
    if (booking) {
      booking.status = 'failed';
      await booking.save();
      console.log(`Booking ${booking._id} marked as failed.`);

      // Optionally, notify the user via Socket.io or email
      // Example:
      // io.emit('payment-failed', { bookingId: booking._id, reason: failedPaymentIntent.last_payment_error.message });
    } else {
      console.warn(`No booking found for PaymentIntent ID: ${failedPaymentIntent.id}`);
    }
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error.message);
  }
};

const handleAccountUpdated = async (account) => {
  try {
    console.log(`Handling account.updated for Account ID: ${account.id}`);

    // Update the corresponding CustomAccount in MongoDB
    const customAccount = await CustomAccount.findOne({ stripe_account_id: account.id });
    if (customAccount) {
      if (account.business_profile && account.business_profile.mcc) {
        customAccount.business_profile.mcc = account.business_profile.mcc;
      }
      // Update other fields as needed
      await customAccount.save();
      console.log(`CustomAccount ${customAccount._id} updated with latest account information.`);
    } else {
      console.warn(`No CustomAccount found for Account ID: ${account.id}`);
    }
  } catch (error) {
    console.error('Error handling account.updated:', error.message);
  }
};

//============================== userStripeCards ===========================

const userStripeCards = async (req, res) => {
  console.log(`Fetching Stripe cards for User ID: ${req.params.id}`);
  try {
    const userId = req.params.id;
    const cardList = await PaymentMethod.find({ userId });
    if (!cardList || cardList.length === 0) {
      return res.status(404).send({ error: 'No cards found for this user' });
    }
    res.status(200).send(cardList);
  } catch (error) {
    console.error('Error fetching card details:', error.message);
    res.status(500).send({ error: error.message });
  }
};

//============================== deleteStripeCard ===========================

const deleteStripeCard = async (req, res) => {
  console.log(`Deleting Stripe card with ID: ${req.params.id}`);
  try {
    const _id = req.params.id;
    const paymentMethod = await PaymentMethod.findById(_id);

    if (!paymentMethod) {
      return res.status(404).send({ error: 'Card not found' });
    }

    // Detach the payment method from Stripe
    await stripe.paymentMethods.detach(paymentMethod.payment_method_id);
    console.log(`PaymentMethod ${paymentMethod.payment_method_id} detached from Stripe.`);

    // Delete the payment method from MongoDB
    await PaymentMethod.deleteOne({ _id: _id });
    console.log(`PaymentMethod document with ID ${_id} deleted from MongoDB.`);

    res.status(200).send({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting Stripe card:', error.message);
    res.status(500).send({ error: error.message });
  }
};

//============================== setCardToDefault ===========================

const setCardToDefault = async (req, res) => {
  console.log(`Setting default card with Payload: `, req.body);
  try {
    const _id = req.body.cardPayload._id;
    const userId = req.body.cardPayload.userId;

    if (!_id || !userId) {
      return res.status(400).send({ error: 'Card ID and User ID are required.' });
    }

    const cardList = await PaymentMethod.find({ userId });
    console.log(`Current card list for User ID ${userId}: `, cardList);

    // Start a session for atomicity
    const session = await PaymentMethod.startSession();
    session.startTransaction();

    try {
      // Set all cards to not default
      await PaymentMethod.updateMany({ userId }, { defaultCard: false }, { session });

      // Set the selected card as default
      const card = await PaymentMethod.findOneAndUpdate(
        { _id: _id, userId },
        { defaultCard: true },
        { new: true, session }
      );

      if (!card) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).send({ error: "Card not found." });
      }

      // Update Stripe Customer's default payment method
      const customer = await stripe.customers.retrieve(card.stripeCustomerId);
      if (customer) {
        await stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: card.payment_method_id,
          },
        });
        console.log(`Stripe Customer ${customer.id} updated with default payment method ${card.payment_method_id}.`);
      }

      await session.commitTransaction();
      session.endSession();

      console.log(`Card ${_id} set as default for User ID ${userId}.`);
      res.status(200).send({ message: 'Default card set successfully.', card });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error setting default card:', error.message);
    res.status(500).send({ error: error.message });
  }
};

//============================== deleteStripeCard ===========================

// Note: The deleteStripeCard function is already defined above.

//============================== Exporting Functions ===========================

module.exports = {
  createNewPayment,
  updateStripeAccount,
  setCardToDefault,
  deleteStripeCard,
  TransactionInitiation,
  userStripeCards,
  fetchUserCardDetails,
  stripeCustomConnectedAccount,
  handleStripeWebhook, // Exporting the webhook handler
};
