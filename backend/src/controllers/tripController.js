const Booking = require('../models/rideBookings');
const PricingModel = require('../models/pricingModel'); // Assuming you have a model for pricing

// Function to update booking status
const updateBookingStatus = async (req, res) => {
    const status = req.body;
    const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Function to calculate invoice
const calculateInvoice = async (req, res) => {
  const { bookingId, endLocation } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Assuming you have a method to calculate distance
    const distance = calculateDistance(booking.startLocation, endLocation);

    // Fetch the pricing details based on the service type
    const pricing = await PricingModel.findOne({ serviceType: booking.serviceType });

    if (!pricing) {
      return res.status(404).json({ message: 'Pricing details not found' });
    }

    const totalFare = distance * pricing.pricePerKm; // Example calculation
    booking.totalFare = totalFare;
    booking.endLocation = endLocation;
    booking.status = 'Completed';
    await booking.save();

    res.status(200).json({ message: 'Invoice calculated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
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
