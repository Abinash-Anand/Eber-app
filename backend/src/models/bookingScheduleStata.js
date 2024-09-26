const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Existing fields
  // ...

  // New fields for scheduler state
  schedulerState: {
    rejectedDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }],
    currentDriverIndex: { type: Number, default: 0 },
    assignmentStatus: { type: String, enum: ['Pending', 'Assigned', 'Completed', 'Cancelled'], default: 'Pending' },
    assignmentTimestamp: { type: Date },
    expirationTimestamp: { type: Date },
    // Add any other fields needed for tracking state
  },
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
