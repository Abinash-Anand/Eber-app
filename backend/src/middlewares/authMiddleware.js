const { getUser } = require('../services/auth');

const auth = (req, res, next) => {
    const token = req.cookies.uid;
    if (!token) {
        return res.status(401).send({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = getUser(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send({ message: 'Invalid token.' });
    }
};

module.exports = auth;
