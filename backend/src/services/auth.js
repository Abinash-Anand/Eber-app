const jwt = require('jsonwebtoken');
const secretKey = 'adminAbinash25#@';

function setUser(user) {
    try {
        return jwt.sign({
            _id: user._id,
            email: user.email
        }, secretKey, { expiresIn: '20m' }); // Token expires in 1 hour
    } catch (error) {
        return null;
    }
}

function getUser(token) {
    if (!token) {
        return null;
    }
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
}

module.exports = { setUser, getUser };
