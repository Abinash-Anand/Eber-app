const Booking = require('../models/rideBookings'); // Ensure the correct path to your model
const cron = require('node-cron'); // For scheduling tasks
const driverModel = require('../models/driverVehiclePricingModel'); // Ensure the correct path to your model
const DriverVehicleModel = require('../models/driverVehiclePricingModel')
const chalk = require('chalk')
const Ride = require('../models/createRideModel')
// Object to store timeouts for each booking
const bookingTimeouts = {};
const mongoose = require('mongoose')
// let currentIndex = 0; // To keep track of the current driver index being checked
let iteration =0
let listOfDriversRejectedBooking = [];
let countdownIntervalId; // To store the interval ID for the countdown timer
let uniqueRejectedDrivers;
let cronScheduler;
const scheduledReassignDriver = async ( booking, io, driver) => {
  // console.log("Booking", booking);
  // console.log("DRiver: ", driver)
  try {
    // console.log("Iteration: ", iteration)
    if (driver !== null) {
      // console.log("IF BLOCK Current Driver:  ", driver)
    const driverId = new mongoose.Types.ObjectId(driver.driverObjectId._id);
    const driverIdString = driverId.toString();//"dhfiuwyy9ewyrrw33443"- example
    listOfDriversRejectedBooking.push(driverIdString)
    uniqueRejectedDrivers = [...new Set(listOfDriversRejectedBooking)]
    // console.log("IF SET ARRAY: ", uniqueRejectedDrivers)
    } else {
    const driverId = new mongoose.Types.ObjectId(booking.driverObjectId._id);
    const driverIdString = driverId.toString();//"dhfiuwyy9ewyrrw33443"- example
    listOfDriversRejectedBooking.push(driverIdString)
     uniqueRejectedDrivers = [...new Set(listOfDriversRejectedBooking)]
    // console.log("ELSE SET ARRAY: ", uniqueRejectedDrivers)
    }

   
    // Find the booking request with populated fields
    const bookingRequest = await Booking.findOne({ _id: booking._id })
    .populate('driverObjectId')
    .populate('city');
    
    if (!bookingRequest) {
      console.error('Booking request not found');
      countdownIntervalId = null;
      stopCountdown();
      return;

    }
    
    // Fetch all drivers with populated fields
    const allDriversList = await DriverVehicleModel.find()
    .populate('city')
    .populate('driverObjectId');
    
    // console.log("Available Drivers:", allDriversList.length);
    
    // Filter available drivers by city, status, and vehicle type
    const availableDriverList = allDriversList.filter((driver) => 
      driver.city.city === bookingRequest.city.city &&
    driver.driverObjectId.status === bookingRequest.driverObjectId.status &&
        driver.vehicleType === bookingRequest.serviceType
      // console.log(`checking filter availableDriverList ${driver.city.city} === ${bookingRequest.city.city}`) 
      // console.log(`checking filter availableDriverList ${driver.driverObjectId.status} === ${bookingRequest.driverObjectId.status}` )  
      // console.log(`checking filter availableDriverList ${driver.vehicleType} === ${bookingRequest.serviceType}` )  
      
    
  );
  
  // console.log("Available Drivers after filtering:", availableDriverList.length);
  
// Create a Set of rejected driver IDs for fast lookup
const rejectedDriverIds = new Set(uniqueRejectedDrivers.map(driverId => driverId));

// Exclude drivers who have already rejected this booking
const filteredDriverList = availableDriverList.filter(driver => {
  const driverIdString =  new mongoose.Types.ObjectId(driver.driverObjectId._id).toString();
  const isRejected = rejectedDriverIds.has(driverIdString);
  // console.log(`Driver ID: ${driverIdString} - Rejected: ${isRejected}`);
  return !isRejected;
});

// console.log("Filtered Driver List after excluding rejected drivers:", filteredDriverList.length);


// console.log("Filtered Driver List after excluding rejected drivers:", filteredDriverList.length);

    if (filteredDriverList.length === 0 ) {
      console.log('No more drivers available to check.');
      console.log("Available Driver's length: ", filteredDriverList.length)
      const reassignedBookingStatus = reassignBookingToPending(booking)
      
      io.emit('no-drivers-available', { bookingId: booking._id });
      io.emit('ride-rejected-by-driver', reassignedBookingStatus)
      stopCountdown(); // Stop the countdown timer
      return;
    }

    // Select the current driver from the filtered list
    const currentDriver = filteredDriverList[0];
    // console.log("Current Driver: ", currentDriver);

    // Assign the driver to the booking
    const driverAssignedToBookings = await driverAssignedWithABooking(currentDriver, booking, listOfDriversRejectedBooking);

    // Emit the driver details to the client via socket.io
    io.emit('cron-driver-assignment', driverAssignedToBookings);
    iteration++
    // Set up a timeout to handle driver non-response
    const timeoutDuration = 15000; // 15 seconds or any desired duration
    const timeoutId = setTimeout(() => {
      console.log(`Driver ${currentDriver.driverObjectId._id} did not respond in time for booking ${booking._id}`);
      console.log("INSIDE SET TIMEOUT Driver Value: ", currentDriver)
      scheduledReassignDriver(booking, io, currentDriver); // Re-run the function with the next driver

    }, timeoutDuration);

    // Start the countdown timer
    startCountdown(timeoutDuration / 1000, io, booking);

    // Listen for client response on driver acceptance or rejection
     // Listen for driver response from any client
 io.on('driver-response-to-cron', (socket) => {
  console.log('Client connected with id:', socket.id);

  // Listen for driver response from any client
  socket.on('driver-response-to-cron', (response, ack) => {
    console.log("RESPONSE FROM DRIVER: ", response);
    clearTimeout(timeoutId); // Clear the timeout if driver responds

    if (response.booking.status === 'Accepted') {
      console.log(`Driver ${currentDriver.driverObjectId._id} accepted for booking ${booking._id}`);
      stopCountdown(); // Stop the countdown timer

      // Send acknowledgment back to the client
      if (ack) {
        ack({ status: 'success', message: 'Booking accepted' });
      }
    } else {
      console.log(`Driver ${currentDriver.driverObjectId._id} rejected for booking ${booking._id}`);
      scheduledReassignDriver(booking, io, currentDriver); // Re-run the function with the next driver

      // Send acknowledgment back to the client
      if (ack) {
        ack({ status: 'failure', message: 'Booking rejected' });
      }
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected with id:', socket.id);
  });
});
    
  } catch (error) {
    console.error('Error in scheduledReassignDriver:', error);
  }
};


//Reassigning the status Pending as no driver left to assign booking
const reassignBookingToPending = async (booking) => {
  const rideRequest = await Ride.findById(booking.bookingId._id)
  if (!rideRequest) {
    throw new Error('Ride Request Not Found! ', rideRequest)
  }
  await Booking.findByIdAndDelete(booking._id)
  rideRequest.status = "Pending";
  await rideRequest.save();
  console.log("Ride Request Updated TO PENDING: ", rideRequest)
  return rideRequest;
 }
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

const driverAssignedWithABooking = async (currentDriver, booking,listOfDriversRejectedBooking ) => {
  console.log(chalk.inverse("Current Driver and Booking", currentDriver.username, booking._id));
  try {
    // Fetch the booking and associated ride to update
    const bookingToUpdate = await Booking.findById(booking._id).populate('driverObjectId').populate('bookingId');
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

//       const allRideBookings = await Booking.find()
//           .populate('bookingId')
//           .populate('driverObjectId')
//           .populate('city')  
 
//         const filteredRidesArray = allRideBookings.filter(ride => 
//   !listOfDriversRejectedBooking.some(rejected => {
//     const rideDriverId = ride.driverObjectId._id.toString(); // Convert to string
//     const rejectedId = rejected; // Convert to string if it's an ObjectID

//     // console.log("Check Comparison rideDriverId: ", rideDriverId); // Properly log both IDs
//     // console.log( rejectedId); // Properly log both IDs

//     return rideDriverId === rejectedId; // Correct comparison
//   })
// );

// Optionally, add a new ride or modify the array in some other way
    // filteredRidesArray.push(bookingToUpdate);
    // console.log(`==========FIltered Rides Array ${filteredRidesArray.length}========`);
    // console.log("Updated ConfirmRide Booking:", rideToUpdate);
    console.log("DRIVER => RIDE RELATION: ",bookingToUpdate)
    return bookingToUpdate; // Return the updated booking document

  } catch (error) {
    console.error("Error in driverAssignedWithADriver:", error.message);
    throw new Error("Check your Try Block, something is causing an issue.");
  }
};


// Function to stop the countdown timer
const stopCountdown = () => {
  if (countdownIntervalId || cronScheduler) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }
  if (cronScheduler) {
    cronScheduler.stop(); // Stop the cron job from running further
     cronScheduler = null
    console.log('Cron scheduler destroyed.');
      console.log("cronScheduler: ", cronScheduler)
      console.log("countdownIntervalId: ", countdownIntervalId)
  }
  
};

const cronSchedularExecuter = (booking, io, driver) => {
  cronScheduler =  cron.schedule('*/15 * * * * *', () => {
    scheduledReassignDriver(booking, io, driver);
  });
  if (!cronScheduler) {
    console.log('CRON SCHEDULER DESTROYED')
  }
};
module.exports = {cronSchedularExecuter, countdownIntervalId, cronScheduler, stopCountdown}