const express = require('express');
const router = express.Router();
const { vehicleTypeController, vehicleData } = require('../controllers/controllers');
const upload = require('../config/multerConfig');

// Route to get the data from the vehicle type form
router.post('/submit-vehicle-type', upload.single('vehicleImage'), vehicleTypeController);
//Router to get the from server vehicle data
router.get('/req-vehicle-data', vehicleData )
module.exports = router;
