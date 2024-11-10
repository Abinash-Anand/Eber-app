require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('./db/mongoose'); // Ensure this path is correct
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const routers = require('./routers/routers'); // Ensure this path is correct
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('./models/rideBookings'); // Ensure the correct path
const Ride = require('./models/createRideModel'); // Ensure the correct path
const {
  saveSessionToDB,
  startSessionTimer,
  autoSaveToRedis,
  markSessionInactive,
  resumeSessionAfterRestart,
  cleanUpExpiredSessions,
  sessionCountdownTimer
} = require('./services/sessionTimer');
const { scheduledReassignDriver, resumePendingAssignments } = require('./utils/scheduler'); // Adjust the path accordingly
const cluster = require('cluster');
const os = require('os');
const whitelist = [
  process.env.FRONTEND_URL_1,
  process.env.FRONTEND_URL_2,
  process.env.FRONTEND_URL_3,
  process.env.FRONTEND_URL_4
].filter(Boolean); // This removes any undefined values if env vars are not set

// Redis client setup for general session management
const redis = require('redis');
const redisClient = redis.createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });

// Use the number of available CPU cores
const numCPUs = os.cpus().length;
const port = process.env.PORT || 5000;

// Redis error handling
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Ensure Redis is connected
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis successfully connected');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

if (cluster.isMaster) {
  // If it's the master process, fork workers for each CPU core
  console.log(`Master process is running. Forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // Fork a worker process for each core
  }

  // If a worker dies, restart it
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork(); // Fork a new worker process when one dies
  });
} else {
  // Worker processes: run the express server
  const app = express();
  const server = http.createServer(app);
 const io = socketIo(server, {
  cors: {
    origin: whitelist,
    methods: ['GET', 'POST'],
    credentials: true
  }
});


  console.log(`Worker ${process.pid} started`);

  app.use(cookieParser());
  app.use(express.json());


const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.error(`Origin not allowed by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};
  app.options('*', cors(corsOptions)); // Allow preflight requests on all routes
  app.use(bodyParser.json());
  app.use('/uploads', express.static('uploads'));
  app.use(routers);

  // Store the io instance in the app object
  app.set('socketio', io);

  // On server startup, resume active sessions
  resumeSessionAfterRestart();

  // Start the session cleanup job in the background
  cleanUpExpiredSessions();

  io.on('connection', (socket) => {
    console.log('New client connected, Socket ID:', socket.id);

    // Clean up previous driver-response-to-cron listener to avoid duplicates
    socket.removeAllListeners('driver-response-to-cron');

    socket.on('driver-response-to-cron', async (response, ack) => {
      try {
        const { bookingId, driverId, status } = response;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          console.error('Booking not found for bookingId:', bookingId);
          if (ack) ack({ status: 'failure', message: 'Booking not found' });
          return;
        }

        // Check if the responding driver is the one currently assigned
        if (booking.schedulerState.currentDriverId.toString() !== driverId) {
          console.warn('Driver ID mismatch. Expected:', booking.schedulerState.currentDriverId.toString(), 'Received:', driverId);
          if (ack) ack({ status: 'failure', message: 'You are not the assigned driver' });
          return;
        }

        if (status === 'Accepted') {
          booking.status = 'Accepted';
          booking.schedulerState.assignmentStatus = 'Completed';
          await booking.save();

          const rideRequest = await Ride.findById(booking.bookingId._id);
          if (rideRequest) {
            rideRequest.status = 'Accepted';
            await rideRequest.save();
          }

          io.emit('driver-accepted', { bookingId, driverId });
          if (ack) ack({ status: 'success', message: 'Booking accepted' });
        } else {
          // Driver rejected
          booking.schedulerState.rejectedDrivers.push(driverId);
          booking.schedulerState.currentDriverId = null;
          booking.schedulerState.assignmentStatus = 'Pending';
          await booking.save();

          // Retry assignment with the next driver
          scheduledReassignDriver(bookingId, io);

          if (ack) ack({ status: 'success', message: 'Booking rejected' });
        }
      } catch (error) {
        console.error('Error handling driver response:', error);
        if (ack) ack({ status: 'failure', message: 'Internal server error' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected, Socket ID:', socket.id);
    });
  });

  server.listen(port, async () => {
    console.log(`Worker ${process.pid} server listening on port: ${port}`);
    await resumePendingAssignments(io); // Start processing pending assignments
  });
}
