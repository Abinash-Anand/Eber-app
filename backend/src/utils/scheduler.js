const Booking = require('../models/rideBookings');
const DriverVehicleModel = require('../models/driverVehiclePricingModel');
const Ride = require('../models/createRideModel');
const { sendVapidPushNotification } = require('./pushNotifications'); // Import the VAPID notification utility
const countdownIntervals = {}; // To store interval IDs for countdowns

// Function to handle driver assignment and response for both manual and auto assignments
const scheduledReassignDriver = async (bookingId, io) => {
  try {
    console.log('Starting scheduledReassignDriver for booking:', bookingId);

    // Fetch the booking request with populated fields
    const bookingRequest = await Booking.findOne({ _id: bookingId })
      .populate('driverObjectId')
      .populate('city');

    if (!bookingRequest) {
      console.error('Booking request not found for bookingId:', bookingId);
      return;
    }

    // Check if the booking has been completed or cancelled
    if (['Completed', 'Cancelled'].includes(bookingRequest.schedulerState.assignmentStatus)) {
      console.log(`Booking ${bookingId} has been ${bookingRequest.schedulerState.assignmentStatus}. Exiting scheduler.`);
      return;
    }

    // **Handle Manual Assignment**
    if (bookingRequest.assignmentType === 'manual') {
      console.log('Handling manual assignment for booking:', bookingId);

      // If a driver is already assigned, we need to wait for their response
      if (bookingRequest.driverObjectId && bookingRequest.schedulerState.currentDriverId) {
        console.log('Driver is already assigned. Waiting for driver response.');
        bookingRequest.schedulerState.assignmentStatus = 'Assigned';
        await bookingRequest.save();

        // Start the countdown timer
        startCountdown(bookingRequest._id, bookingRequest.requestTimer, io, bookingRequest.driverObjectId);

        return;
      } else {
        console.error('No driver assigned for manual booking:', bookingId);
        return;
      }
    }

    // **Handle Auto Assignment**

    // Fetch all drivers with populated fields
    const allDriversList = await DriverVehicleModel.find()
      .populate('city')
      .populate('driverObjectId');

    console.log('Total drivers fetched:', allDriversList.length);

    // Filter available drivers by city, status, and vehicle type
    const availableDriverList = allDriversList.filter((driver) =>
      driver.city.city === bookingRequest.city.city &&
      driver.driverObjectId.status === 'approved' && // Only approved drivers
      driver.vehicleType === bookingRequest.serviceType
    );

    console.log('Available drivers after filtering by city, status, and vehicle type:', availableDriverList.length);

    // Exclude drivers who have already rejected this booking
    const rejectedDriverIds = bookingRequest.schedulerState.rejectedDrivers.map((driverId) => driverId.toString());
    console.log('Rejected driver IDs:', rejectedDriverIds);

    const filteredDriverList = availableDriverList.filter((driver) => {
      const driverIdString = driver.driverObjectId._id.toString();
      return !rejectedDriverIds.includes(driverIdString);
    });

    console.log('Filtered driver list after excluding rejected drivers:', filteredDriverList.length);

    if (filteredDriverList.length === 0) {
      console.log('No more drivers available to assign for booking:', bookingId);
      // Call the function to reassign booking to pending
      await reassignBookingToPending(bookingRequest);

      io.emit('no-drivers-available', {
        bookingId: bookingRequest._id,
        filteredDriverList: filteredDriverList,
      });

      // Send push notification to user about no drivers available
      const subscription = bookingRequest.userSubscription; // Assuming userSubscription object is stored for the booking
      if (subscription) {
        sendVapidPushNotification(subscription, 'No Drivers Available', 'No drivers accepted your ride request.');
      }

      return;
    }

    // Select the next driver
    const currentDriver = filteredDriverList[0];
    console.log('Assigning next driver:', currentDriver.driverObjectId._id.toString(), 'to booking:', bookingId);

    // Update scheduler state in the booking
    bookingRequest.schedulerState.currentDriverId = currentDriver.driverObjectId._id;
    bookingRequest.schedulerState.assignmentTimestamp = new Date();
    bookingRequest.schedulerState.expirationTimestamp = new Date(Date.now() + bookingRequest.requestTimer * 1000);
    bookingRequest.schedulerState.assignmentStatus = 'Assigned';

    console.log('Updating booking scheduler state with current driver and timestamps.');
    await bookingRequest.save();

    // Assign the driver to the booking
    await driverAssignedWithABooking(currentDriver, bookingRequest);

    // Emit the driver assignment to the client
    io.emit('cron-driver-assignment', {
      booking: bookingRequest,
      driver: currentDriver,
      driverArrayLength: filteredDriverList.length,
    });
    console.log('Emitted cron-driver-assignment event for booking:', bookingId);

    // Start the countdown timer
    startCountdown(bookingRequest._id, bookingRequest.requestTimer, io, currentDriver);
  } catch (error) {
    console.error('Error in scheduledReassignDriver for booking:', bookingId, 'Error:', error);
  }
};

// Function to start the countdown and emit updates to the client
const startCountdown = (bookingId, remainingTime, io, currentDriver) => {
  console.log(`Starting countdown for booking: ${bookingId}`);

  let countdown = remainingTime;
  const intervalId = setInterval(async () => {
    if (countdown <= 0) {
      clearInterval(intervalId);
      countdownIntervals[bookingId] = null; // Set to null instead of deleting
      console.log(`Countdown expired for booking: ${bookingId}`);

      // Handle timeout once countdown expires
      await handleDriverResponseTimeout(bookingId, io, currentDriver);
    } else {
      // Emit countdown update to the client every second
      io.emit('countdown-update', {
        bookingId: bookingId,
        countdown: countdown,
      });
      console.log(`Booking ${bookingId}: ${countdown} seconds remaining`);
      countdown -= 1;
    }
  }, 1000);

  // Store the interval ID to clear later if needed (e.g., if driver responds)
  countdownIntervals[bookingId] = intervalId;
};

// Function to handle driver response timeout
const handleDriverResponseTimeout = async (bookingId, io, currentDriver) => {
  try {
    console.log('Driver response time expired for booking:', bookingId);

    // Clear the countdown timer
    clearCountdown(bookingId);

    // Fetch the latest booking data
    const updatedBooking = await Booking.findById(bookingId);

    console.log('Fetched updated booking after timeout:', updatedBooking);

    // If the driver hasn't accepted yet and booking is still 'Assigned'
    if (
      updatedBooking.schedulerState.assignmentStatus === 'Assigned' &&
      updatedBooking.schedulerState.currentDriverId
    ) {
      console.log('Driver did not accept booking:', bookingId);

      // For auto assignment, we need to add driver to rejected list and reassign
      if (updatedBooking.assignmentType === 'auto' && currentDriver) {
        console.log('Auto assignment: Reassigning to next driver.');

        // Add driver to rejectedDrivers using $addToSet to prevent duplicates
        await Booking.updateOne(
          { _id: bookingId },
          {
            $addToSet: { 'schedulerState.rejectedDrivers': currentDriver.driverObjectId._id },
            $set: {
              'schedulerState.currentDriverId': null,
              'schedulerState.assignmentStatus': 'Pending',
            },
          }
        );

        // Retry assignment with next driver
        scheduledReassignDriver(bookingId, io);
      } else if (updatedBooking.assignmentType === 'manual') {
        console.log('Manual assignment: Cancelling booking due to driver non-response.');

        // Update booking and ride status to 'Pending'
        updatedBooking.status = 'Pending';
        updatedBooking.schedulerState.assignmentStatus = 'Cancelled';
        await updatedBooking.save();

        const rideRequest = await Ride.findById(updatedBooking.bookingId);
        if (rideRequest) {
          rideRequest.status = 'Pending';
          await rideRequest.save();
        }

        // Notify user if needed
        io.emit('booking-cancelled', { bookingId: updatedBooking._id });

        // Send push notification to user for manual assignment failure
        const subscription = updatedBooking.userSubscription; // Assuming userSubscription object is stored for the booking
        if (subscription) {
          sendVapidPushNotification(subscription, 'Driver Rejected', 'The assigned driver did not accept your ride request.');
        }
      }
    } else {
      console.log(
        'Booking assignment status after driver response:',
        updatedBooking.schedulerState.assignmentStatus
      );
      // Do nothing, as booking is either completed or cancelled
    }
  } catch (error) {
    console.error('Error in handleDriverResponseTimeout for booking:', bookingId, 'Error:', error);
  }
};

// Function to handle driver assignment to booking
const driverAssignedWithABooking = async (currentDriver, booking) => {
  try {
    console.log('Assigning driver to booking:', booking._id);

    // Fetch the booking and associated ride to update
    const bookingToUpdate = await Booking.findById(booking._id)
      .populate('driverObjectId')
      .populate('bookingId');
    const rideToUpdate = await Ride.findById(booking.bookingId._id);

    if (!bookingToUpdate || !rideToUpdate) {
      throw new Error('Booking or Ride not found');
    }

    // Update the booking and ride fields
    bookingToUpdate.driverObjectId = currentDriver.driverObjectId; // Assign new driver
    bookingToUpdate.status = 'Assigned'; // Update status of booking
    rideToUpdate.status = 'Assigned'; // Update status of ride

    // Save the updated documents
    await bookingToUpdate.save();
    await rideToUpdate.save();

    console.log(
      'Driver assigned to booking:',
      bookingToUpdate._id,
      'Driver ID:',
      currentDriver.driverObjectId._id
    );
    return bookingToUpdate; // Return the updated booking document
  } catch (error) {
    console.error(
      'Error in driverAssignedWithABooking for booking:',
      booking._id,
      'Error:',
      error.message
    );
    throw new Error('Check your Try Block, something is causing an issue.');
  }
};

// Function to reassign booking to pending when no drivers are left
const reassignBookingToPending = async (booking) => {
  try {
    console.log('Reassigning booking to pending. Booking ID:', booking._id);

    const rideRequest = await Ride.findById(booking.bookingId._id);
    if (!rideRequest) {
      throw new Error('Ride Request Not Found!');
    }

    // Update booking and ride status to 'Pending'
    booking.status = 'Pending';
    booking.schedulerState.assignmentStatus = 'Pending';
    booking.schedulerState.currentDriverId = null;
    booking.schedulerState.assignmentTimestamp = null;
    booking.schedulerState.expirationTimestamp = null;
    await booking.save();

    rideRequest.status = 'Pending';
    await rideRequest.save();
    console.log('Ride Request Updated TO PENDING:', rideRequest._id);
    return rideRequest;
  } catch (error) {
    console.error(
      'Error in reassignBookingToPending for booking:',
      booking._id,
      'Error:',
      error.message
    );
    throw new Error('Failed to reassign booking to pending.');
  }
};

// Function to resume pending assignments on server startup
const resumePendingAssignments = async (io) => {
  try {
    console.log('Resuming pending assignments on server startup.');
    const pendingBookings = await Booking.find({
      'schedulerState.assignmentStatus': { $in: ['Pending', 'Assigned'] },
      status: { $in: ['Pending', 'Assigned'] },
    });

    pendingBookings.forEach((booking) => {
      const now = new Date();
      const expiration = booking.schedulerState.expirationTimestamp || now;

      if (expiration > now) {
        const remainingTime = Math.ceil((expiration - now) / 1000);
        console.log(
          'Resuming countdown for booking:',
          booking._id,
          'with',
          remainingTime,
          'seconds remaining'
        );
        // Start the countdown
        startCountdown(booking._id, remainingTime, io, null); // Assuming currentDriver is null here
      } else {
        // If the assignment has expired or no assignment, proceed with reassigning
        console.log('Booking:', booking._id, 'has expired assignment. Reassigning now.');
        scheduledReassignDriver(booking._id, io);
      }
    });
  } catch (error) {
    console.error('Error resuming pending assignments:', error);
  }
};

// Function to clear countdown when driver responds
const clearCountdown = (bookingId) => {
  const intervalId = countdownIntervals[bookingId];
  if (intervalId) {
    clearInterval(intervalId);
    countdownIntervals[bookingId] = null; // Set to null instead of deleting
    console.log(`Cleared countdown for booking: ${bookingId}`);
  }
};

module.exports = { scheduledReassignDriver, resumePendingAssignments, clearCountdown };
