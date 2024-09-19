
const Driver = require('../models/driverModel');
const { createContact, deactivateContact } = require('./razorpayGateway')
const { driverBankAccount } = require('./driverBankAccount')
const {stripeCustomConnectedAccount} = require('./stripePayment')
const CustomAccount = require('../models/stripeDriverAccount')

// Create User Route - POST request
const createNewDriver = async (req, res) => {
    console.log("Driver Payload", req.body)
    try {

            //-------- creating razorpay contact{Driver}--------------
        // const fundAccountContact = await createContact(req.body);
        
        // Check if the username or email already exists
        const existingUser = await Driver.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });

        if (existingUser) {
            throw new Error("Username or email already in use");
        }
        
        // Create a new user
        const driverObject = {
            userProfile: req.body.userProfile,
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            countryCode:req.body.countryCode,
            city: req.body.city,
            serviceType: req.body.serviceType,
            status: req.body.status,
            // contactId:fundAccountContact.id
            // [email, phone, country, city, serviceType,status,contactId]
        }
        console.log("new Driver: ", driverObject)
        const newUser = new Driver(driverObject);
        //----------CREATING FUND ACCOUNT custom connected account-------------------
        // const driverStripeCustomAccount = await stripeCustomConnectedAccount(newUser);
        //  console.log('Driver Account: ', driverStripeCustomAccount)
        // const newDriverAccount = new CustomAccount({
            //     driverStripeCustomAccount
            // });
            // console.log("newDriverAccount: ", newDriverAccount)
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
        console.log(searchCriteria)
        const driver = await Driver.find(searchCriteria);
        res.status(200).send(driver);
    } catch (error) {
        console.error('Error fetching specific user:', error);
        res.status(500).send({ message: 'Server Error' });
    }
};

// Read All Drivers Route - GET request with Optional Sorting and Pagination
const allDriverIfSortedInclude = async (req, res) => {
    console.log("Testing pagination: ", req.query); // Enhanced logging for debugging
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const size = parseInt(req.query.size) || 5; // Default to 5 items per page
        const sortBy = req.query.sortBy || 'username'; // Default sorting by 'username'
        const sortOrder = req.query.sortOrder || 'asc'; // Default to ascending
        const sortDirection = sortOrder === 'desc' ? -1 : 1;

        console.log("Received Request Query:", req.query);
        console.log("Sort By:", sortBy, "Sort Order:", sortOrder);

        // Validate sort field
        const validSortFields = ['username', 'email', 'phone', 'userProfile', 'countryCode', 'city'];
        if (sortBy && !validSortFields.includes(sortBy)) {
            return res.status(400).json({ 
                error: 'Invalid sort column', 
                validFields: validSortFields // Provide a list of valid fields for better client-side handling
            });
        }

        // Calculate the number of documents to skip
        const skip = (page - 1) * size;

        // Dynamic query construction based on filters (if any)
        let query = {};
        if (req.query.isActive) { // Assuming you want to filter by 'isActive'
            query.isActive = req.query.isActive === 'true';
        }

        // Prepare sorting options
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortDirection;
        }

        // Query the database
        const totalDriversCount = await Driver.countDocuments(query);
        const drivers = await Driver.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(size)
            .lean(); // Improves performance by returning plain JS objects

        // Handle edge case where page is out of range
        const totalPages = Math.ceil(totalDriversCount / size);
        if (page > totalPages && totalPages > 0) {
            return res.status(404).json({ message: "Page not found" });
        }

        // Construct and send the response
        res.status(200).json({
            drivers,
            page,
            size,
            totalPages,
            totalDrivers: totalDriversCount
        });

    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ error: error.message });
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
        if(user.contactId){
        await deactivateContact(user.contactId)
            
        }
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


const sortedDriverTable = async (req, res) => {
  try {
    // Extract and validate query parameters
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensure page is at least 1
    const size = Math.max(parseInt(req.query.size) || 10, 1); // Ensure size is at least 1
    const sortBy = req.query.sortBy || 'username'; // Default sorting by username
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default to ascending

    console.log("Received Request Body:", req.body);
    console.log("Sort By:", sortBy, "Sort Order:", sortOrder === 1 ? "Ascending" : "Descending");

    // Validate sortBy field
    const validSortFields = ['userProfile', 'username', 'email', 'phone', 'countryCode', 'city'];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: 'Invalid sort column' });
    }

    // Calculate pagination parameters
    const skip = (page - 1) * size;

    // Query database with sorting and pagination
    const drivers = await Driver.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(size)
      .lean(); // Use .lean() for better performance if you don't need Mongoose documents

    // Count total drivers for pagination
    const totalDrivers = await Driver.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalDrivers / size);

    // Ensure the requested page does not exceed total pages
    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({ error: 'Page number exceeds total pages' });
    }

    // Send response
    res.status(200).json({
      drivers,
      page,
      size,
      totalPages,
      totalDrivers, // Optional: Include total count if needed on the client side
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





module.exports = { 
    createNewDriver, 
    allDriverIfSortedInclude, 
    updateDriver, 
    deleteDriver, 
    searchDriver,
    updateDriverServiceType,
  toggleDriverStatus,
    allDriversStatus,
 
};
