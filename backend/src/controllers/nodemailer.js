require('dotenv').config();
const nodemailer = require("nodemailer");
const EmailSettings = require('../models/emailSettings');

// Function to fetch the latest email settings from MongoDB
const getEmailSettings = async () => {
  try {
    const settings = await EmailSettings.findOne().sort({ createdAt: -1 }).exec();
    if (!settings) {
      throw new Error('No email settings found');
    }
    return settings;
  } catch (error) {
    console.error('Error fetching email settings:', error);
    throw error;
  }
};

// Function to create a transporter with dynamic settings from the database
const createTransporter = async () => {
  const settings = await getEmailSettings();
  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.secureConnection,
    auth: {
      user: settings.emailUser,
      pass: settings.emailPass,
    },
  });
  return transporter;
};

// Function to send an email with dynamic settings
const sendMail = async (email, subject, text, html) => {
  try {
    const settings = await getEmailSettings(); // Fetch settings for 'from' information
    const transporter = await createTransporter(); // Create transporter with dynamic settings
    const info = await transporter.sendMail({
      from: `"${settings.fromName}" <${settings.fromEmail}>`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // For Ethereal testing
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Controller function to send a welcome email
const sendWelcomeEmail = async (user) => {
  const subject = "Welcome to Eber Rides!";
  const text = `Hola ${user.name}, welcome to Our App! We're glad to have you.`;
  const html = `<div>
                  <h1 style="color: 'green'">Login Successful</h1>
                  <p> <strong>${user.name}</strong>, welcome to Our App! We're glad to have you.</p>
                 </div>`;
  try {
    await sendMail(user.email, subject, text, html);
    console.log("Welcome email sent successfully!");
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};

// Controller function to send an invoice email
const sendInvoiceEmail = async (email, name, invoice) => {
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
                </div>`;
  try {
    await sendMail(email, subject, text, html);
    console.log("Invoice email sent successfully!");
  } catch (error) {
    console.error("Failed to send invoice email:", error);
  }
};

// Controller function to save email settings
const emailSettings = async (req, res) => {
  console.log("Email Settings: ", req.body)
  try {
    const settingsData = req.body;
    const emailSettings = new EmailSettings(settingsData);
    await emailSettings.save();
    res.status(200).json({ message: 'Email settings saved successfully!' });

  } catch (error) {
    console.error("Error saving email settings:", error);
    res.status(500).json({ message: 'Error saving email settings', error });
  }
};

module.exports = { sendWelcomeEmail, sendInvoiceEmail, emailSettings };
