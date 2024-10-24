    require('dotenv');
    const nodemailer = require('nodemailer')
    const {sendWelcomeEmail} = require('./nodemailer')
    const { v4: uuidv4 } = require('uuid');
    const User = require('../models/signupUser');
    const { setUser, getUser } = require('../services/auth');
    const bcrypt = require('bcrypt');
    const {sessionController,logoutStopTimer} =  require('../services/sessionTimer')
     const {
  saveSessionToDB,
  startSessionTimer,
  autoSaveToRedis,
  markSessionInactive,
  resumeSessionAfterRestart,
  cleanUpExpiredSessions,
  sessionCountdownTimer
} = require('../services/sessionTimer')
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
            res.status(200).send({ message: 'Login successful', token });
            await sendWelcomeEmail(user);
            //create web push creds
            // webPush()
            const io = req.app.get('socketio');
            sessionCountdownTimer(io, user._id, initialHours = 0,
                initialMinutes = 59, initialSeconds = 60);
         
        } catch (error) {
            console.error('Login error:', error); // Log error for debugging
            res.status(500).send(error);
        }
    };


    const loggedOutSessionTimer = async (req,res)=>{
    logoutStopTimer()
    }



    

    module.exports = { user, loginUser,loggedOutSessionTimer };
