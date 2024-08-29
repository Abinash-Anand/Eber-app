require('dotenv');
const nodemailer = require('nodemailer')
const {sendWelcomeEmail} = require('./nodemailer')
const { v4: uuidv4 } = require('uuid');
const User = require('../models/signupUser');
const { setUser, getUser } = require('../services/auth');
const bcrypt = require('bcrypt');

// Set the countdown time in hours, minutes, and seconds
let hours = 1;    // Example: 1 hour
let minutes = 0;  // Example: 0 minutes
let seconds = 0;  // Example: 0 seconds

// Convert total time to seconds
let totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;



const user = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        console.log(newUser);
        res.status(201).send({ message: "User Signup Successful!", newUser });
    } catch (error) {
        console.error('Signup error:', error); // Log error for debugging
        res.status(500).send({ errorMessage: 'Internal server error', error });
    }
};

const loginUser = async (req, res, next,io) => {
    console.log(req.body);
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        await sendWelcomeEmail(user);
        const token = setUser(user);
        // await countdownInterval(io);
        console.log('JWT Token:', token); // Log the JWT token
        res.cookie('uid', token, {
            httpOnly: false,
            secure: false, // Ensure this is false for HTTP
            sameSite: 'None', // Allow cross-site cookies
            maxAge: 60 * 1000
        });
        console.log('Cookie set with token');
        res.status(200).send({ message: 'Login successful' ,token});
    } catch (error) {
        console.error('Login error:', error); // Log error for debugging
        res.status(500).send(error);
    }
};




// Function to format the time as HH:MM:SS
function formatTime(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return {
    hours: hrs.toString().padStart(2, '0'),
    minutes: mins.toString().padStart(2, '0'),
    seconds: secs.toString().padStart(2, '0')
  };
}

// Function to update the countdown timer
function updateCountdown(io) {
  if (totalTimeInSeconds > 0) {
    totalTimeInSeconds--; // Decrease the total time by 1 second

    // Emit the updated time to the client
    const formattedTime = formatTime(totalTimeInSeconds);
    io.emit('session-timer', formattedTime);

    // Log to the server console (for debugging purposes)
    console.log(`${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`);
  } else {
    clearInterval(countdownInterval); // Clear the interval when the countdown is over
    io.emit('timer-finished', { message: "Countdown finished!" }); // Notify clients that the countdown has finished
    console.log("Countdown finished!");
  }
}

// Start the countdown timer and emit updates every second
const countdownInterval = async (io) => {
    
    setInterval(updateCountdown, 1000); // Update every second
}
    

module.exports = { user, loginUser };
