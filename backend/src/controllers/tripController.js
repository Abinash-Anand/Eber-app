
const Booking = require('../models/rideBookings');
// const PricingModel = require('../models/pricingModel'); // Assuming you have a model for pricing
const Ride = require('../models/createRideModel')
const Invoice = require('../models/invoice')
const Counter = require('../models/mongoose-sequencer');
const { default: mongoose } = require('mongoose');
// Function to update booking status
const updateBookingStatus = async (req, res, io) => {
  const { _id, bookingId, status } = req.body;

  try {
    const ride = await Ride.findById(bookingId);
      const booking = await Booking.findById(_id).populate('country')
          .populate('city').populate('driverObjectId');

    if (!booking || !ride) {
      return res.status(404).json({ message: 'Booking or ride not found' });
    }

    booking.status = status;
    ride.status = status;
    
    // await booking.save();
    // await ride.save();
    const reqId = new mongoose.Types.ObjectId(booking.bookingId);
    // console.log("Booking Id: ", id.toString())
    const id = reqId.toString()
    if (booking.status === 'Completed') {
      
      calculateInvoice(id)
    }
    console.log('Emitting rideStatusProgressed event with status:', status); // Log event emission
    io.emit('rideStatusProgressed', ride);

    res.status(200).json({ message: 'Booking status updated successfully', booking, ride });
  } catch (error) {
    console.error('Error updating booking status:', error); // Log the error
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};



// Function to calculate invoice
async function calculateInvoice(id) {
  console.log("ID: ", id);
  const test = '5678yuhjnmmmm';
  console.log("test: ", test)
  try {
    // Ensure the ID is a valid ObjectId
   
    const booking = await Booking.findOne({ _id: id });
    if (!booking) {
      throw new Error('No Booking Found');
    }

    // Manually fetch the next sequence number
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'invoiceNo' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newInvoice = new Invoice({
      invoiceNo: counter.seq, // Manually assign the invoice number
      bookingId: booking._id,
      EstimatedTime: booking.EstimatedTime,
      bookingOption: booking.bookingOption,
      city: booking.city,
      country: booking.country,
      driverObjectId: booking.driverObjectId,
      dropOffLocation: booking.dropOffLocation,
      fromLocation: booking.fromLocation,
      paymentOption: booking.paymentOption,
      phone: booking.phone,
      pickupLocation: booking.pickupLocation,
      scheduleDateTime: booking.scheduleDateTime,
      selectedCard: booking.selectedCard,
      serviceType: booking.serviceType,
      status: booking.status,
      stopLocations: booking.stopLocations,
      toLocation: booking.toLocation,
      totalDistance: booking.totalDistance,
      vehicleImageURL: booking.vehicleImageURL,
      vehicleName: booking.vehicleName,
      vehicleType: booking.vehicleType,
      userId: booking.userId,
      requestTimer: booking.requestTimer,
      dueDate: new Date(), // Set as per your logic
    });

    console.log("New Invoice: ", newInvoice);

    await newInvoice.save();

    return newInvoice;
  } catch (error) {
    console.error("Error calculating invoice: ", error);
    // Optionally, you can rethrow the error if you want it to be handled by an upstream function or caller
    throw error;
  }
};


// Dummy function to calculate distance between two points
const calculateDistance = (startLocation, endLocation) => {
  // Implement your distance calculation logic here
  return 10; // Placeholder value
};

// Function to submit feedback
const submitFeedback = async (req, res) => {
  const { bookingId, feedback } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.feedback = feedback;
    await booking.save();

    res.status(200).json({ message: 'Feedback submitted successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

module.exports = {
  updateBookingStatus,
  calculateInvoice,
  submitFeedback,
};
