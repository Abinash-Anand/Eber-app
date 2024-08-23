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

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200", // Adjust this to your frontend URL
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 5000;

console.log('Loaded .env file:', process.env.PORT);


console.log('Port used by server:', port);

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:4200', // Adjust this to your frontend URL
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(routers);

// Store the io instance in the app object
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
    console.log(`The server is live at port: ${port}`);
});
