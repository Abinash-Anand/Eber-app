// // utils/redisAssignmentQueue.js
// const Queue = require('bull');

// // Configure Redis connection options
// const redisConfig = {
//   host: '127.0.0.1', // Change if using a remote Redis server
//   port: 6379,
// };

// // Create a new Bull queue for ride assignments
// const rideAssignmentQueue = new Queue('ride-assignment', {
//   redis: redisConfig,
// });

// // Redis event listeners for debugging
// rideAssignmentQueue.on('completed', (job) => {
//   console.log(`Job completed for bookingId: ${job.data.bookingId}`);
// });

// rideAssignmentQueue.on('failed', (job, err) => {
//   console.error(`Job ${job.id} failed: ${err.message}`);
// });

// module.exports = rideAssignmentQueue;
