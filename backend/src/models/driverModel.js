const mongoose = require('mongoose');
const validator = require('validator');

const driverSchema = new mongoose.Schema({
    userProfile: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(email) {
            if (!(validator.isEmail(email))) {
                throw new Error('Invalid email provided!');
            }
        }
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        maxLength: 10
    },
    countryCode: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    serviceType: {
        type: String,
        required: false, // This can be optional initially
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['approved', 'declined'],
        default: 'declined' // Default status
    },
    contactId: {
        type: String,
        required:true,
        unique:true
    },
    
}, { timestamps: true });

const driverModel = mongoose.model('driverModel', driverSchema);
module.exports = driverModel;
