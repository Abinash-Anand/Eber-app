require('dotenv').config(); // Load environment variables from .env file
console.log('Loaded .env file:', process.env.PORT); // Debugging statement
const cookieParser = require('cookie-parser')

const express = require("express");
const app = express();
require('./db/mongoose'); // Ensure this path is correct

const port = process.env.PORT || 5000; // Use environment variable or default to 5000
console.log('Port used by server:', port); // Debugging statement

const routers = require('./routers/routers'); // Ensure this path is correct
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(cookieParser())
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(routers); // Use routers
app.use(bodyParser.json())
// app.use(express.static('uploads'));
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`The server is live at port: ${port}`);
});
