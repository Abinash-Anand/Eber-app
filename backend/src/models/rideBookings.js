const mongoose = require('mongoose');

const rideBookingSchema = new mongoose.Schema({
  EstimatedTime: {
    type: String,
    required: true
  },
  bookingOption: {
    type: String,
    required: true
  },
  city: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "zoneModel",
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  driverObjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DriverVehicleModel',
    required: true,
    unique:true
  },
  dropOffLocation: {
    type: String,
    required: true
  },
  fromLocation: {
    type: String,
    required: true
  },
  paymentOption: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  scheduleDateTime: {
    type: Date,
    required: true
  },
  selectedCard: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending','Assigned','Cancelled', 'Accepted', 'Arrived', 'Picked', 'Started', 'Completed'],
    default: 'Pending'
  },
  stopLocations: {
    type: String,
    default: "[]"
  },
  toLocation: {
    type: String,
    required: true
  },
  totalDistance: {
    type: String,
    required: true
  },
  vehicleImageURL: {
    type: String,
    required: true,
  },
  vehicleName: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true
    },
   requestTimer: {
        type: Number,
        required:true,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required:true
   }
}, { timestamps: true });
rideBookingSchema.index({ bookingId: 1 })

const RideBooking = mongoose.model('RideBooking', rideBookingSchema);
RideBooking.ensureIndexes().then(() => {
  console.log('Indexes ensured');
}).catch(error => {
  console.error('Indexing error:', error);
});

module.exports  =  RideBooking
