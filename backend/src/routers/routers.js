const express = require('express');
const router = express.Router();
const { vehicleTypeController, vehicleData, updateVehicleData } = require('../controllers/controllers');
const upload = require('../config/multerConfig');

// Route to get the data from the vehicle type form
router.post('/submit-vehicle-type', upload.single('vehicleImage'), vehicleTypeController);
// Route to get the vehicle data from server
router.get('/req-vehicle-data', vehicleData);
// Route to update the vehicle data
router.patch('/update-vehicle-data/:id', updateVehicleData);

module.exports = router;