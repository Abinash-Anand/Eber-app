// // processors/rideAssignmentProcessor.js
// const rideAssignmentQueue = require('../utils/redisAssignmentQueue');
// const Booking = require('../models/rideBookings');
// const { handleDriverAssignment } = require('../utils/scheduler');

// // Adding Jobs with Retry Logic
// const addRideAssignmentJob = async (bookingId) => {
//   try {
//     await rideAssignmentQueue.add(
//       { bookingId },
//     //   { attempts: 3, backoff: 5000 } // Retry up to 3 times with a 5-second delay between attempts
//     );
//     console.log(`Job added for booking ${bookingId} with retry logic`);
//   } catch (error) {
//     console.error(`Failed to add job for booking ${bookingId}:`, error);
//   }
// };

// // Process jobs in the ride assignment queue
// rideAssignmentQueue.process(async (job) => {
//   const { bookingId } = job.data;
//   console.log(`Processing booking: ${bookingId} for driver assignment`);
  
//   try {
//     await handleDriverAssignment(bookingId); // Your driver assignment logic here
//     console.log(`Successfully processed booking ${bookingId}`);
//   } catch (error) {
//     console.error(`Failed to process booking ${bookingId}:`, error);
//     throw error; // Allows Bull to retry the job if it fails
//   }
// });

// // Handle failed jobs
// rideAssignmentQueue.on('failed', (job, err) => {
//   console.error(`Job ${job.id} failed: ${err.message}`);
//   // Optional: Additional error handling, like sending notifications or logging
// });

// module.exports = { rideAssignmentQueue, addRideAssignmentJob };
