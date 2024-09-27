const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentMethod = require('../models/stripePayment'); // Adjust the path as necessary
const Booking = require('./bookedRidesController');
const Pricing = require('../models/pricingModel');
const chalk = require('chalk')
const CustomAccount = require('../models/stripeDriverAccount');
const driverModel = require('../models/driverModel');


const createNewPayment = async (req, res) => {
  const { paymentMethod } = req.body; // Payment method data from request body
  
  if (!paymentMethod || !paymentMethod.id) {
    return res.status(400).send({ error: 'Invalid payment method' });
  }

  // Capture the client's IP address from the request object
  const client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // Check if a payment method with the same card_last4 already exists for this user
    const existingPaymentMethod = await PaymentMethod.findOne({
      card_last4: paymentMethod.card.last4,
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

      // Update existing payment method details in MongoDB
      existingPaymentMethod.payment_method_id = paymentMethod.id;
      existingPaymentMethod.client_ip = client_ip;
      await existingPaymentMethod.save();

      return res.status(200).send(existingPaymentMethod);
    }
    
  } catch (error) {
    console.error('Error saving payment method:', error.message);
    return res.status(500).send({ error: error.message });
  }
};

const TranscationInitiation = async (booking) => {
  console.log("Booking: ", booking);
  try {
    // Fetch the payment method and ensure it includes the customer ID
    const paymentMethod = await PaymentMethod.findOne({ userId: booking.userId._id });

    if (!paymentMethod) {
      return { error: 'No payment method found for this user' };
    }

    // Use the Stripe customer ID stored in the payment method document
    const customerId = paymentMethod.stripeCustomerId; // Correctly use the field storing the customer ID

    // console.log("Payment Method: ", paymentMethod);

    // Check if customerId is a valid string
    if (typeof customerId !== 'string' || !customerId.trim()) {
      throw new Error('Customer ID must be a valid non-empty string.');
    }

    // Create a Payment Intent using the saved payment_method_id and customer ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.bookingId.totalFare * 100,
      currency: 'INR',
      payment_method: paymentMethod.payment_method_id,
      customer: customerId,  // Correctly include the customer ID here
      confirm: true,
      return_url: 'http://localhost:4200/rides/confirm-ride',
      description: `Charge for trip ${booking.bookingId._id}`,
    });

    if (paymentIntent.status === 'succeeded') {
      const pricing = await Pricing.findOne({ city: booking.city._id });
      if (!pricing) {
        console.error('Pricing Data not found');
        throw new Error('Pricing data not found');
      }
      const {  amount,
      currency,
      payment_method,
      customer,// Correctly include the customer ID here
      confirm,
      return_url,
      description} = paymentIntent
    //   console.log("Pricing: ", pricing);
      const driverShare = (paymentIntent.amount * (pricing.driverProfit / 100));
      // console.log(chalk.bgCyan.bold("Intent: ",  amount,
      // currency,
      // payment_method,
      // customer,// Correctly include the customer ID here
      // confirm,
      // return_url,
      // description ))
      // console.log(chalk.bgWhite.bold("Driver Profit: ",driverShare))
      // console.log(chalk.bgYellow.bold("Driver: ",booking.driverObjectId))
      //  console.log("Payment URL: ",paymentIntent.return_url) 
      // const paymentReceived = await createRazorpayTransfer(booking.driverObjectId, driverShare);
      return paymentIntent;
    } else {
      throw new Error('Payment Intent was not successful');
    }
  } catch (error) {
    console.error('Error during transaction initiation:', error.message);
    throw error;
  }
};

const fetchUserCardDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(req.params.id);
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
  console.log("account creation response: ", account)
    // Create CustomAccount Document in MongoDB
    const customAccount = new CustomAccount({
      stripe_account_id: account.id, // Save Stripe Account ID
      driverObjectId:driver._id,
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

    // Optionally, you might want to associate the CustomAccount with the Driver
    // For example:
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

// Define the sequential function to handle all steps
// {
//   "accept_tos": true,
//   "account_holder_name": "John Doe",
//   "account_holder_type": "individual",
//   "account_number": "DE89370400440532013000",
//   "business_mcc": "4789",
//   "card_capabilities": true,
//   "country": "DE"
// }
const updateStripeAccount = async (req, res) => {
  try {
    const driverId = req.params.id;

    // Validate the presence of driverId
    if (!driverId) {
      console.error("Driver ID is missing in params.");
      return res.status(400).json({ error: "Driver ID is required in params." });
    }

    // Find the CustomAccount associated with the driver
    const driverAccount = await CustomAccount.findOne({ driverObjectId: driverId });
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
        currency: 'eur',                   // EUR is the currency in Germany
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
        card_payments: { requested: cardCapabilitiesResponse.capabilities.card_payments },
        transfers: { requested:cardCapabilitiesResponse.capabilities.transfers },
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




const userStripeCards = async (req, res) => {
  console.log(req.params.id)
  try {
    const _id = req.params.id
  const cardList = await PaymentMethod.find({userId:_id})
  if (!cardList) {
    return res.status(404).send("Cards not Found")
  }
  res.status(200).send(cardList)
  } catch (error) {
    res.status(500).send(error)
  }
}
const deleteStripeCard = async (req, res) => {
  console.log(req.params.id)
  try {
    const _id = req.params.id
    const deleteCard = await PaymentMethod.deleteOne({ _id:_id })
    res.status(200).send(deleteCard)
  } catch (error) {
    res.status(500).send(error)
  }
}

const setCardToDefault = async (req, res) => {
  console.log(req.body)
  try {
    const _id = req.body.cardPayload._id
    const userId = req.body.cardPayload.userId
    const cardList = await PaymentMethod.find({ userId})
    console.log(cardList)
  await Promise.all(
      cardList.map(card => {
        card.defaultCard = false;
        return card.save(); // Save each card individually
      })
    );
    const card = await PaymentMethod.findOne({_id})
    if (!card) {
      return res.status(404).send("Card not found")
    };
    card.defaultCard = req.body.cardPayload.defaultCard
    await card.save()
    console.log(card)
    res.status(201).send(card)
    
  } catch (error) {
    res.status(500).send(error.message)
  }
}
module.exports = { createNewPayment,updateStripeAccount,setCardToDefault,deleteStripeCard, TranscationInitiation,userStripeCards, fetchUserCardDetails,stripeCustomConnectedAccount };
