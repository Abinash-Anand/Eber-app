const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // Existing booking fields
  EstimatedTime: { type: String, required: true },
  bookingOption: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'zoneModel', required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  driverObjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'driverModel' },
  dropOffLocation: { type: String, required: true },
  fromLocation: { type: String, required: true },
  paymentOption: { type: String, required: true },
  phone: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  scheduleDateTime: { type: Date, required: true },
  selectedCard: { type: String, default: 'cash' },
  serviceType: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Cancelled', 'Accepted', 'Completed', "Arrived", "Picked", "Started"],
    default: 'Pending'
  },
  stopLocations: { type: String },
  toLocation: { type: String, required: true },
  totalDistance: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  requestTimer: { type: Number, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  vehicleImageURL: { type: String, required: true },
  vehicleType: { type: String, required: true },

  // Scheduler State Fields
  schedulerState: {
    rejectedDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'driverModel' }],
    assignmentStatus: {
      type: String,
      enum: ['Pending', 'Assigned', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    currentDriverId: { type: mongoose.Schema.Types.ObjectId, ref: 'driverModel' },
    assignmentTimestamp: { type: Date },
    expirationTimestamp: { type: Date },
    // Any other fields needed for tracking state
  },
    assignmentType: { type: String, enum: ['manual', 'auto'], default: 'auto' }, // or use a boolean flag like isManual: Boolean

}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
