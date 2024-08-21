const chalk = require('chalk');
const Booking = require('../models/rideBookings');
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
    // console.log("ID: ", booking.bookingId._id)
    await booking.save();
    await ride.save();
    const reqId = new mongoose.Types.ObjectId(booking.bookingId._id);
    // console.log("Booking Id: ", id.toString())
    // console.log(JSON.stringify(reqId))
    const id = reqId.toString()
    let inovice;
    if (booking.status === 'Completed') {
    inovice =   await calculateInvoice(id)
      // console.log(chalk.blue(id))
    }
    // console.log('Emitting rideStatusProgressed event with status:', status); // Log event emission
    io.emit('rideStatusProgressed', ride);

    res.status(200).json({ message: 'Booking status updated successfully', booking, ride , inovice});
  } catch (error) {
    console.error('Error updating booking status:', error); // Log the error
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};



// Function to calculate invoice
async function calculateInvoice(id) {
  try {
    // Ensure the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return console.log(chalk.yellow("ID is not valid"))
    }

    const booking = await Booking.findOne({bookingId:id});
    if (!booking) {
     return console.log(chalk.yellow('Booking not Found!'))
    }

    // Manually fetch the next sequence number for invoiceNo
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
      dueDate: new Date(), // Set the due date based on your business logic
    })

    await newInvoice.save();

    console.log(chalk.bgGreen("New Invoice Created: ", newInvoice));

    return newInvoice;
  } catch (error) {
    console.error("Error calculating invoice: ", error);
    throw error;
  }
}


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


