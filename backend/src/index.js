//================================ index.js =======================================
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
const { scheduledReassignDriver, resumePendingAssignments } = require('./utils/scheduler'); // Adjust the path accordingly

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', // Adjust this to your frontend URL
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT || 5000;

console.log('Loaded .env file:', process.env.PORT);

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:4200', // Adjust this to your frontend URL
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(routers);

// Store the io instance in the app object
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('New client connected, Socket ID:', socket.id);

  socket.on('driver-response-to-cron', async (response, ack) => {
    try {
      console.log('Received driver response:', response);

      const { bookingId, driverId, status } = response;
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        console.error('Booking not found for bookingId:', bookingId);
        if (ack) ack({ status: 'failure', message: 'Booking not found' });
        return;
      }

      console.log('Fetched booking for driver response:', booking);

      // Check if the responding driver is the one currently assigned
      if (booking.schedulerState.currentDriverId.toString() !== driverId) {
        console.warn('Driver ID mismatch. Expected:', booking.schedulerState.currentDriverId.toString(), 'Received:', driverId);
        if (ack) ack({ status: 'failure', message: 'You are not the assigned driver' });
        return;
      }

      if (status === 'Accepted') {
        console.log('Driver accepted booking:', bookingId, 'Driver ID:', driverId);
        // Update booking and ride status
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
        console.log('Driver rejected booking:', bookingId, 'Driver ID:', driverId);
        // Driver rejected
        booking.schedulerState.rejectedDrivers.push(driverId);
        booking.schedulerState.currentDriverId = null;
        booking.schedulerState.assignmentStatus = 'Pending';
        await booking.save();

        // Retry assignment with next driver
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
  console.log(`The server is live at port: ${port}`);
  await resumePendingAssignments(io); // Start processing pending assignments
});
