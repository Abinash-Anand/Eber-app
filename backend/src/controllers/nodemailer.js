require('dotenv').config();
const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email", // Example using Ethereal (for testing)
  port: 587,
  secure: false, // Use true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER, // Fetch email from environment variables
    pass: process.env.EMAIL_PASS, // Fetch password from environment variables
  },
});

// Function to send an email
const sendMail = async (email, subject, text, html) => {
    console.log('Email: ', process.env.EMAIL_USER)
    console.log('PASS: ', process.env.EMAIL_PASS )
    
    try {
      console.log('Inside send mail function')
    const info = await transporter.sendMail({
      from: `Eber Rides <${process.env.EMAIL_USER}>`, // Sender address
      to: email, // Receiver address
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html, // HTML body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // Only for Ethereal
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// Controller function to send a welcome email
const sendWelcomeEmail = async (user) => {
    //   const { email, name } = req.body; // Get email and name from the request body
    // console.log("USer: ", user)
  const subject = "Welcome to Eber Rides!";
  const text = `Hola ${user.name}, welcome to Our App! We're glad to have you.`;
    const html = `<div>
                  <h1 style="color: 'green'">Login Successful</h1>
                  <p> <strong>${user.name}</strong>, welcome to Our App! We're glad to have you.</p>
                 </div>`;
  
  try {
    await sendMail(user.email, subject, text, html); // Send the email

  } catch (error) {
    console.log(error);
    
  }
};
const sendInvoiceEmail = async (email, name, invoice) => {
    console.log(`Invoice NO ${invoice.invoiceNo}`);
    
  const subject = "Your Trip Invoice";
  const text = `Hi ${name}, thank you for using our service. Please find your trip invoice attached.`;
  const html = `<div class="container mt-5">
    <!-- Header Section -->
    <div class="card bg-light text-center p-4 mb-3">
        <h2 class="card-title mb-1">Thanks for riding, ${name}</h2>
        <p class="card-text">We hope you enjoyed your Ride.</p>
        <div class="d-flex justify-content-between align-items-center">
            <div class="text-start">
                <p class="text-muted mb-0">Total: <strong>$ ${invoice.totalFare}</strong></p>
                <p class="text-muted mb-0">${invoice.createdAt.toLocaleDateString('en-US')}</p>
            </div>
            <div>
                <img width="64" height="64" src="https://img.icons8.com/cotton/64/taxi--v3.png" alt="taxi--v3"/>
            </div>
        </div>
    </div>

    <!-- Total Section -->
    <div class="text-center mb-4">
        <h3 class="fw-bold">Total <span class="d-block">$ ${invoice.totalFare}</span></h3>
    </div>

    <!-- Trip Details Section -->
    <ul class="list-group mb-3">
        <li class="list-group-item d-flex justify-content-between">
            <span>Trip Fare</span>
            <span>$ ${invoice.tripFare}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <span>Subtotal</span>
            <span>$ ${invoice.tripFare}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
            <span>Platform Charge:
                <span class="text-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Airport charge details.">?</span>
            </span>
            <span>$ ${invoice.platformCharge}</span>
        </li>
     
    </ul>

    <!-- Payment Method Section -->
    <div class="mb-4">
        <div class="d-flex justify-content-between">
            <span>Amount Charged</span>
            <span>$ ${invoice.totalFare}</span>
        </div>
        <div class="d-flex align-items-center">
<img width="54" height="54" src="https://img.icons8.com/3d-fluency/94/stripe.png" alt="stripe"/>
        </div>
    </div>

    <hr>

</div>`; // Replace this with your full invoice HTML template
    // console.log('Email: ', email)
//   console.log(`====inside invoice nodemailer:  ${subject}, ${html}`)
    try {
    await sendMail(email, subject, text, html); // Send the email
    console.log("Invoice email sent successfully!");
  } catch (error) {
    console.error("Failed to send invoice email:", error);
    throw error; // Re-throw the error if needed
  }
};

module.exports = { sendWelcomeEmail, sendInvoiceEmail };


