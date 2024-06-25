const express = require('express');
const router = express.Router();
const { vehicleTypeController, vehicleData, updateVehicleData } = require('../controllers/vehicleTypeController');
const upload = require('../config/multerConfig');
const { addCountry, getCountries, singleCountry } = require('../controllers/countryController');
const { addZone, allCities, allCountries } = require('../controllers/cityController')
const {user, loginUser} = require('../controllers/signupController')
// Route to get the data from the vehicle type form
router.post('/submit-vehicle-type', upload.single('vehicleImage'), vehicleTypeController);
// Route to get the vehicle data from server
router.get('/req-vehicle-data', vehicleData);
// Route to update the vehicle data
router.patch('/update-vehicle-data/:id', updateVehicleData);

//======================Country routes================================
//post route to submit data 
router.post('/add-country', addCountry);
//get route to get all countries
router.get('/get-countries', getCountries)
//get single country
router.get('/get-country/:id', singleCountry)
//=============city routes============================================
//post data
router.post('/add-zone', addZone)
//get data
router.get('/cities/by-country/:id', allCities)
//get all cities
router.get('/get-countriesList', allCountries )

//=============================authentication routes===========================
//sign up routes
router.post('/signup', user)
//login user
router.post('/login', loginUser)
module.exports = router;