const express = require('express');
const router = express.Router();
const { vehicleTypeController } = require('../controllers/controllers');
const upload = require('../config/multerConfig');

// Route to get the data from the vehicle type form
router.post('/submit-vehicle-type', upload.single('vehicleImage'), vehicleTypeController);

module.exports = router;
