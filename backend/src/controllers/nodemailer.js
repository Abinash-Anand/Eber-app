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
  const html = `<div class="container my-5">
      <!-- Invoice Header -->
      <div class="row invoice-header">
          <div class="col-md-6">
              <h2>Invoice</h2>
              <p><strong>Invoice Number:</strong> ${invoice.invoiceNo}</p>
              <p><strong>Date:</strong> ${invoice.invoiceDate}</p>
              <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <div class="col-md-6 text-right">
              <h4>Seller</h4>
              <p><strong>Eber</strong></p>
              <img class="mt-5" src="${invoice.vehicleImageURL}" style="width: 10rem; height:max-content" alt="">
          </div>
      </div>

      <!-- Buyer Information -->
      <div class="row">
          <div class="col-md-6">
              <h4>Buyer</h4>
              <p>User ID: <strong>${invoice.userId}</strong><br>Phone: <strong>${invoice.phone}</strong></p>
          </div>
      </div>

      <!-- Booking Details -->
      <div class="row">
          <div class="col-md-12">
              <h4>Booking Details</h4>
              <p><strong>Booking ID:</strong> ${invoice.bookingId}</p>
              <p><strong>Service Type:</strong> ${invoice.serviceType}</p>
              <p><strong>Vehicle Name:</strong> ${invoice.vehicleName}</p>
              <p><strong>Vehicle Type:</strong> ${invoice.vehicleType}</p>
              <p><strong>Pickup Location:</strong> ${invoice.pickupLocation}</p>
              <p><strong>Drop Off Location:</strong> ${invoice.dropOffLocation}</p>
              <p><strong>Estimated Time:</strong> ${invoice.EstimatedTime} Min</p>
              <p><strong>Total Distance:</strong> ${invoice.totalDistance} km</p>
          </div>
      </div>

      <!-- Invoice Table -->
      <div class="row">
          <div class="col-md-12">
              <h4>Description</h4>
              <table class="table table-bordered">
                  <thead>
                      <tr>
                          <th>Description</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>Base Price (1 km)</td>
                          <td>1</td>
                          <td>$20.00</td>
                          <td>$20.00</td>
                      </tr>
                      <tr>
                          <td>Distance Price (${invoice.totalDistance} km)</td>
                          <td>1</td>
                          <td>$10.00/km</td>
                          <td>$${invoice.totalDistance * 10}</td>
                      </tr>
                      <tr>
                          <td>Time Price (${invoice.EstimatedTime} minutes)</td>
                          <td>1</td>
                          <td>$1.00/min</td>
                          <td>$${invoice.EstimatedTime * 1}</td>
                      </tr>
                      <tr>
                          <td><strong>Total</strong></td>
                          <td></td>
                          <td></td>
                          <td><strong>$${invoice.totalFare}</strong></td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Payment Information -->
      <div class="row">
          <div class="col-md-6">
              <h4>Payment Information</h4>
              <p><strong>Payment Option:</strong> ${invoice.paymentOptions}</p>
          </div>
      </div>

      <!-- Footer -->
      <div class="row invoice-footer">
          <div class="col-md-12 text-center">
              <p>Thank you for your business!</p>
              <p>If you have any questions regarding this invoice, please contact us at (123) 456-7890.</p>
          </div>
      </div>
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


