const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentMethod = require('../models/stripePayment'); // Adjust the path as necessary
const Booking = require('./bookedRidesController');
const Pricing = require('../models/pricingModel');
const { createRazorpayTransfer } = require('./razorpayGateway');
const chalk = require('chalk')


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
    const driver = req.body;  // Extract driver data from request body
console.log("driver account: ", req.body)
    const account = await stripe.accounts.create({
      country: 'DE',  // Germany country code
      type: 'custom', // Express account type
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',  // Driver is an individual
      individual: {
        first_name: driver.firstName,
        last_name: driver.lastName,
        email: driver.email,
        phone: driver.phoneNumber,
        dob: {
          day: driver.dob.day,
          month: driver.dob.month,
          year: driver.dob.year,
        },
        address: {
          line1: driver.address.line1,
          city: driver.address.city,
          postal_code: driver.address.postal_code,
          state: driver.address.state,
          country: 'DE',  // Germany country code
        },
      },
      business_profile: {
        url: 'https://your-platform-url.com',  // Replace with your platform URL
      }
    });

    // Create the Account Link for onboarding (see Step 2)
    // const accountLink = await createAccountLink(account.id);

    res.status(201).send({ account });  // Return the created account and the onboarding link
  } catch (error) {
    console.error('Error creating driver Stripe account:', error.message);
    res.status(500).send({ error: error.message });
  }
};


// Define the sequential function to handle all steps
const updateStripeAccount = async (req, res) => {
  try {
    const { accountId } = req.body;  // Extract the account ID from the request body

    // 1. Add Business Profile MCC
   const businessProfile = await stripe.accounts.update(accountId, {
      business_profile: {
        mcc: '4789'  // Example MCC for transportation services
      }
    });
    // console.log('Step 1: Business Profile MCC updated', businessProfile);

    // 2. Add an External Account (Bank Account)
  const extBankAcc =  await stripe.accounts.createExternalAccount(accountId, {
  external_account: {
    object: 'bank_account',
    country: 'DE',  // Germany
    currency: 'eur',  // EUR is the currency in Germany
    account_holder_name: 'John Doe',  // The name of the driver
    account_holder_type: 'individual',  // Type of account holder
    account_number: 'DE89370400440532013000'  // Replace with a valid IBAN
    // Do not include BIC; Stripe derives it from the IBAN
  }
});

    console.log('Step 2: External account (Bank Account) added', extBankAcc);
      
    
    // 4. Request Card Payment Capabilities
   const cardCapabilities =  await stripe.accounts.update(accountId, {
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      }
   });
    // 3. Accept the Terms of Service
  const termsOfService =   await stripe.accounts.update(accountId, {
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),  // Current timestamp
        ip: req.ip || '192.168.1.1'  // Replace with the actual IP address or fallback to a dummy value
      }
    });
    console.log('Step 3: Terms of Service accepted', termsOfService);

    console.log('Step 4: Card Payment and Transfer capabilities requested', cardCapabilities);

    // 5. Check for any remaining requirements
    const account = await stripe.accounts.retrieve(accountId);
    const remainingRequirements = account.requirements.currently_due;
    console.log('Step 5: Remaining requirements checked');

    // Send back the remaining requirements or success message
    if (remainingRequirements.length > 0) {
      res.status(200).json({
        message: 'Account updated but has remaining requirements',
        remaining_requirements: remainingRequirements
      });
    } else {
      res.status(200).json({
        message: 'Account updated successfully and card capabilities activated'
      });
    }
  } catch (error) {
    console.error('Error updating Stripe account:', error.message);
    res.status(500).send({ error: error.message });
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
