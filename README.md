# 🚖 Eber - On-Demand Ride Booking Backend

**Eber** is a full-stack ride-booking platform backend, built using **Node.js**, **Express**, **MongoDB**, and third-party services like **Stripe**, **Twilio**, and **Nodemailer**. It offers a comprehensive admin and driver management system along with ride request tracking, billing, notifications, and history management.

---

## 🌐 Deployment

- **Backend**: Deployed on [Render](https://render.com)
- **Frontend**: Deployed on [Vercel](https://vercel.com)

---

## 📦 Features Overview

### 🔔 Push Notifications

- Real-time **browser push notifications** with sound alerts for admins when a driver is not found.
- A **notification counter** updates dynamically on the admin dashboard.
- The counter decreases when the issue is resolved (i.e., a driver is assigned).

> Planned: Integration for **push notifications on Android and iOS**, each handled according to the native delivery mechanism (Firebase for Android, APNs for iOS).

---

## 🧾 Ride Lifecycle APIs

The system tracks every ride with distinct phases:

1. **Driver Assigned**: Request is created and a driver is assigned.
2. **En Route to Pickup**: Driver starts moving toward the passenger.
3. **Arrived at Pickup**: Driver reaches the pickup location.
4. **Trip Started**: Ride begins.
5. **Trip Ended**: Ride completes, and billing is triggered.
6. **Invoice Generation**:
   - Calculates total cost based on start and end location distance.
   - Applies dynamic pricing set during configuration.
7. **Feedback Collection**: Riders can submit post-trip ratings and reviews.

All APIs are tested and verified using **Postman**.

---

## 📊 Ride History Module

Admins can view detailed ride records:

- Table view showing **completed** and **cancelled** rides.
- Filter options:
  - **Trip status**, **date range**
  - **Pickup & drop-off location**
  - **Search bar** for keywords
- Export feature to download ride logs in **CSV format**
- Click on a ride entry to view:
  - Ride request details
  - Live travel path displayed using **Google Maps Polylines**

---

## ⚙️ System Settings

Manage all third-party service configurations via the admin panel:

- **Stripe Settings** (for payments)
- **Email Settings** (SMTP/Nodemailer setup)
- **SMS Settings** (Twilio configuration)

---

## 💳 Stripe Payment Gateway Integration

- Set up Stripe (US account recommended for full feature access).
- Securely store user cards using Stripe’s tokenization (including 3D Secure cards).
- Charge the user's card at the end of the trip and transfer funds to the **admin's** Stripe account.
- Link **driver’s bank account** to receive payouts.
- API keys and settings are configurable via the admin settings section.

---

## 📧 Email Notification System (Nodemailer)

- Emails sent directly from the backend server (free SMTP)
- Events triggering emails:
  - **Welcome email** on registration
  - **Invoice email** upon ride completion
- Email templates are designed to resemble professional formats like those used by Uber.
- All email server credentials can be managed via the admin interface.

---

## 📱 SMS Alerts with Twilio

- SMS messages triggered by key ride events:
  - Driver accepted a ride
  - Ride started
  - Ride completed
  - Payment confirmation
- SMS settings are configurable from the admin dashboard.

---

## 🧪 API Development & Testing

- All backend routes follow REST standards.
- APIs are tested thoroughly in **Postman**.
- Flags or status indicators are used to track the progress of each trip.
- Designed to be consumed by mobile apps (iOS/Android) and admin panels.

---

## 🏗️ Tech Stack

| Layer        | Technology               |
|--------------|---------------------------|
| Backend      | Node.js, Express.js       |
| Database     | MongoDB (Mongoose)        |
| Templates    | EJS (optional admin panel)|
| Payment      | Stripe API                |
| Email        | Nodemailer (SMTP)         |
| SMS          | Twilio                    |
| Push Alerts  | Web Push (Service Workers), FCM/APNs (planned) |
| Mapping      | Google Maps API (Polyline, Geolocation) |

---

## 📁 Project Folder Structure

```text
backend/
└── src/
    ├── controllers/         # Business logic for each route
    ├── models/              # Mongoose schemas
    ├── routes/              # API route definitions
    ├── middlewares/         # Auth, error handling, etc.
    ├── services/            # Stripe, email, SMS, push, etc.
    ├── utils/               # Helper functions
    ├── config/              # Environment/config loading
    ├── public/              # Static files (if needed)
    ├── app.js               # Express app setup
    └── server.js            # Server entry point
