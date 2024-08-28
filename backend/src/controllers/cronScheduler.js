const Booking = require('../models/rideBookings'); // Ensure the correct path to your model
const cron = require('node-cron'); // For scheduling tasks
const driverModel = require('../models/driverVehiclePricingModel'); // Ensure the correct path to your model
const DriverVehicleModel = require('../models/driverVehiclePricingModel')
const chalk = require('chalk')
const Ride = require('../models/createRideModel')
// Object to store timeouts for each booking
const bookingTimeouts = {};

let listOfDriversRejectedBooking = [];
let currentIndex = 0; // To keep track of the current driver index being checked
let countdownIntervalId; // To store the interval ID for the countdown timer


const scheduledReassignDriver = async (booking, io) => {
    console.log(chalk.bgBlack.bold('Booking Object: ', booking))
  try {
    console.log("Counter: ", currentIndex);

    // Add the rejected driver to the list of rejected bookings
    listOfDriversRejectedBooking.push({ driverId: booking.driverObjectId });

    // Find the booking request with populated fields
    const bookingRequest = await Booking.findOne({ _id: booking._id })
      .populate('driverObjectId')
      .populate('city');

    if (!bookingRequest) {
      console.error('Booking request not found');
      return;
    }

    // Fetch all drivers with populated fields
    const allDriversList = await DriverVehicleModel.find()
      .populate('city')
      .populate('driverObjectId');

    console.log(chalk.bgBlack("Available Drivers:", allDriversList.length));

    // Filter available drivers by city, status, and vehicle type
    const availableDriverList = allDriversList.filter((driver) => {
      return driver.city.city === bookingRequest.city.city &&
        driver.driverObjectId.status === bookingRequest.driverObjectId.status &&
        driver.vehicleType === bookingRequest.serviceType;
    });

    console.log(chalk.bgBlack("Available Drivers after filtering by city, status, and vehicle type:", availableDriverList.length));

    // Exclude drivers who have already rejected this booking
    const filteredDriverList = availableDriverList.filter((driver) =>
      !listOfDriversRejectedBooking.some((cancelledDriver) => cancelledDriver.driverId === driver._id)
    );

    console.log(chalk.bgBlack("Filtered Driver List after excluding rejected drivers:", filteredDriverList.length));

    // If there are no more drivers to check, stop the cron job
    if (currentIndex >= filteredDriverList.length) {
      console.log('No more drivers available to check.');
      io.emit('no-drivers-available', { bookingId: booking._id });
      stopCountdown(); // Stop the countdown timer
      return;
    }

    // Select the current driver from the filtered list
    const currentDriver = filteredDriverList[currentIndex];
    const driverAssignedToBookings = await driverAssignedWithADriver(currentDriver, booking, listOfDriversRejectedBooking)
    // Emit the driver details to the client via socket.io
    io.emit('cron-driver-assignment', driverAssignedToBookings);

    // Set up a timeout to handle driver non-response
    const timeoutDuration = 15000; // 15 seconds or any desired duration
    const timeoutId = setTimeout(() => {
      console.log(`Driver ${currentDriver.driverObjectId._id} did not respond in time for booking ${booking._id}`);
      currentIndex++;
      scheduledReassignDriver(booking, io); // Re-run the function with the next driver
    }, timeoutDuration);

    // Start the countdown timer
    startCountdown(timeoutDuration / 1000, io, booking);

    // Listen for client response on driver acceptance or rejection
   await io.once('driver-response-to-cron', (response) => {
      clearTimeout(timeoutId); // Clear the timeout if driver responds
      stopCountdown(); // Stop the countdown timer
      if (response.accepted) {
        console.log(`Driver ${currentDriver.driverObjectId._id} accepted for booking ${booking._id}`);
        return; // Exit the function to stop the cron job
      } else {
        console.log(`Driver ${currentDriver.driverObjectId._id} rejected for booking ${booking._id}`);
        currentIndex++;
        scheduledReassignDriver(booking, io); // Re-run the function with the next driver
      }
    });

  } catch (error) {
    console.error('Error in scheduledReassignDriver:', error);
  }
};

// Function to start the countdown timer
const startCountdown = (duration, io, booking) => {
  let timeRemaining = duration;

  // Emit initial timer value
  io.emit('request-timer', { booking, timeRemaining });

  // Set interval to emit timer updates every second
  countdownIntervalId = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;

      // Log the countdown timer every second
      console.log(`Countdown for booking ${booking._id}: ${timeRemaining} seconds remaining`);

      io.emit('request-timer', { booking, timeRemaining });
    } else {
      clearInterval(countdownIntervalId); // Clear the interval when timer reaches zero
      }
      
  }, 1000);
};


//===========================FUNCTION TO ASSOCIATE DRIVER WITH THE RIDE BOOKING============

const driverAssignedWithADriver = async (currentDriver, booking,listOfDriversRejectedBooking ) => {
  console.log(chalk.inverse("Current Driver and Booking", currentDriver, booking));
  try {
    // Fetch the booking and associated ride to update
    const bookingToUpdate = await Booking.findById(booking._id).populate('driverObjectId').populate('bookingId');
    const rideToUpdate = await Ride.findById(booking.bookingId._id);

    if (!bookingToUpdate || !rideToUpdate) {
      throw new Error('Booking or Ride not found');
    }

    // Update the booking and ride fields
    bookingToUpdate.driverObjectId._id = currentDriver._id; // Assign new driver
    bookingToUpdate.status = 'Assigned'; // Update status of booking
    rideToUpdate.status = 'Assigned'; // Update status of ride

    // Save the updated documents
    await bookingToUpdate.save();
    await rideToUpdate.save();

      const allRideBookings = await Booking.find()
          .populate('bookingId')
          .populate('driverObjectId')
          .populate('city')  
 
        const filteredRidesArray = allRideBookings.filter(ride => 
  !listOfDriversRejectedBooking.some(rejected => {
    const rideDriverId = ride.driverObjectId._id.toString(); // Convert to string
    const rejectedId = rejected; // Convert to string if it's an ObjectID

    console.log("Check Comparison rideDriverId: ", rideDriverId); // Properly log both IDs
    console.log( rejectedId); // Properly log both IDs

    return rideDriverId === rejectedId; // Correct comparison
  })
);

// Optionally, add a new ride or modify the array in some other way
    filteredRidesArray.push(bookingToUpdate);
    console.log("Filtered Rides Array:", filteredRidesArray);
    // console.log("Updated ConfirmRide Booking:", rideToUpdate);
    
    return filteredRidesArray; // Return the updated booking document

  } catch (error) {
    console.error("Error in driverAssignedWithADriver:", error.message);
    throw new Error("Check your Try Block, something is causing an issue.");
  }
};


// Function to stop the countdown timer
const stopCountdown = () => {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
};

const cronSchedularExecuter = (booking, io) => {
  cron.schedule('*/15 * * * * *', () => {
    scheduledReassignDriver(booking, io);
  });
};
module.exports = {cronSchedularExecuter}