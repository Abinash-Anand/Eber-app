require('dotenv').config(); // Load environment variables at the top
const express = require("express");
require('./db/mongoose'); // Ensure this path is correct
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import cors
const bodyParser = require('body-parser');
const routers = require('./routers/routers'); // Ensure this path is correct

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default to 5000

// Debugging statements
console.log('Loaded .env file:', process.env.PORT);
console.log('Port used by server:', port);

// Middleware to parse JSON bodies
app.use(cookieParser());
app.use(express.json()); // Parse JSON bodies

// CORS configuration to allow only localhost:4200
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 ,// Some legacy browsers choke on 204
    credentials: true // Allow credentials (cookies)

};
app.use(cors(corsOptions)); // Enable CORS with specific options

app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(routers); // Use routers

app.listen(port, () => {
    console.log(`The server is live at port: ${port}`);
});
