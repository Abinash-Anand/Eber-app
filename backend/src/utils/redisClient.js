// // utils/redisClient.js

// const redis = require('redis');
// require('dotenv').config(); // Load environment variables

// // Create and configure the Redis client
// const redisClient = redis.createClient({
//   socket: {
//     host: process.env.REDIS_HOST || '127.0.0.1', // Use environment variables
//     port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
//   },
//   password: process.env.REDIS_PASSWORD || undefined, // Uncomment if your Redis server requires authentication
// });

// // Handle Redis client events
// redisClient.on('error', (err) => {
//   console.error('Redis error:', err);
// });

// redisClient.on('connect', () => {
//   console.log('Connected to Redis.');
// });

// // Connect to Redis
// (async () => {
//   try {
//     await redisClient.connect();
//     console.log('Redis client connected successfully.');
//   } catch (error) {
//     console.error('Failed to connect to Redis:', error);
//   }
// })();

// // Export the connected Redis client
// module.exports = redisClient;
