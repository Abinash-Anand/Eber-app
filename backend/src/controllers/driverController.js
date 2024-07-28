const express = require("express");
const Driver = require('../models/driverModel');

// Create User Route - POST request
const createNewDriver = async (req, res) => {
    try {
        // Check if the username or email already exists
        const existingUser = await Driver.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });

        if (existingUser) {
            throw new Error("Username or email already in use");
        }

        // Create a new user
        const newUser = new Driver(req.body);

        // Save the new user to the database
        await newUser.save();

        res.status(201).send(newUser);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).send(error.message);
    }
};

// SEARCHING A USER BASED ON MULTIPLE CRITERIA
const searchDriver = async (req, res) => {
    try {
        const { username, userProfile, email } = req.query;
        const searchCriteria = {};

        if (username) searchCriteria.username = username;
        if (userProfile) searchCriteria.userProfile = userProfile;
        if (email) searchCriteria.email = email;

        const users = await Driver.find(searchCriteria);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching specific user:', error);
        res.status(500).send({ message: 'Server Error' });
    }
};

// Read All USERS Route- GET request
const allDrivers = async (req, res, next) => {
    try {
        let { page, size } = req.query;
        page = parseInt(page) || 1;
        size = parseInt(size) || 5;

        const limit = size;
        const skip = (page - 1) * size;
        const totalUsersCount = await Driver.countDocuments();
        const totalPages = Math.ceil(totalUsersCount / limit);
        const users = await Driver.find().limit(limit).skip(skip);

        res.status(200).json({
            users,
            page,
            size,
            totalPages,
        });
    } catch (error) {
        res.status500.json({ error: error.message });
    }
};

// Update DRIVER Route- PATCH request
const updateDriver = async (req, res) => {
    try {
        console.log(req.body);
        const { userId, userProfile, username, email, phone, countryCode, city, serviceType, status } = req.body;

        const user = await Driver.findByIdAndUpdate(
            userId, 
            {
                userProfile,
                username,
                email,
                phone,
                countryCode,
                city,
                serviceType, // Update serviceType
                status // Update status
            }, 
            { new: true } // This option ensures the updated document is returned
        );
        console.log(user);

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Delete USER Route- DEL request
const deleteDriver = async (req, res) => {
    try {
        const user = await Driver.findByIdAndDelete(req.params.id);
        console.log(req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Specific function to update serviceType
const updateDriverServiceType = async (req, res) => {
    try {
        const { userId, serviceType } = req.body;

        const driver = await Driver.findByIdAndUpdate(
            userId,
            { serviceType },
            { new: true }
        );

        if (!driver) {
            return res.status(404).send("Driver not found");
        }

        res.status(200).send(driver);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const toggleDriverStatus = async (req, res) => {
    try {
        let { userId, status } = req.body;
        console.log(req.body);

        // Convert status to lowercase before checking
        status = status.toLowerCase();

        if (!['approved', 'declined'].includes(status)) {
            return res.status(400).send("Invalid status");
        }

        const driver = await Driver.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
        );

        if (!driver) {
            return res.status(404).send("Driver not found");
        }

        res.status(200).send(driver);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const allDriversStatus = async (req, res) => {
  try {
    const driverStatus = await Driver.find();
    res.status(200).send(driverStatus)
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = { 
    createNewDriver, 
    allDrivers, 
    updateDriver, 
    deleteDriver, 
    searchDriver,
    updateDriverServiceType,
  toggleDriverStatus,
    allDriversStatus
};
