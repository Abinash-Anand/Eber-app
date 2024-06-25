const { v4: uuidv4 } = require('uuid');
const User = require('../models/signupUser');
const { setUser, getUser } = require('../services/auth');

const user = async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
        });
        await newUser.save();
        console.log(newUser);
        res.status(201).send({ message: "User Signup Successful!", newUser });
    } catch (error) {
        res.status(500).send({ errorMessage: 'Internal server error', error });
    }
};

const loginUser = async (req, res) => {
    console.log(req.body);
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ email: username, password: password });
        if (!user) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }
        const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie('uid', sessionId, { httpOnly: true, secure: false });
        res.status(200).send({ message: 'Login Successful', user });
        console.log(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = { user, loginUser };
