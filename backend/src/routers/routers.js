const express = require('express');
const router = express.Router();
const { vehicleTypeController, vehicleData, updateVehicleData, getVehicleTypesByCity } = require('../controllers/vehicleTypeController');
const upload = require('../config/multerConfig');
const { addCountry, getCountries, singleCountry } = require('../controllers/countryController');
const { addZone, allCities, allCountries } = require('../controllers/cityController');
const { user, loginUser } = require('../controllers/signupController');
const { createVehicleCityAssociation, VehicleTypesByCity } = require('../controllers/vehicleCityController')
const { createNewUser, allUsers } = require('../controllers/userController')
// Route to get the data from the vehicle type form
router.post('/submit-vehicle-type', upload.single('vehicleImage'), vehicleTypeController);

// Route to get the vehicle data from server
router.get('/req-vehicle-data', vehicleData);

// Route to update the vehicle data
router.patch('/update-vehicle-data/:id', updateVehicleData);

// Route to get vehicle types by city
router.get('/vehicle-types/:cityId', getVehicleTypesByCity);

//======================Country routes================================
//post route to submit data 
router.post('/add-country', addCountry);
//get route to get all countries
router.get('/get-countries', getCountries);
//get single country
router.get('/get-country/:id', singleCountry);

//=============city routes============================================
//post data
router.post('/add-zone', addZone);
//get data
router.get('/cities/by-country/:id', allCities);
//get all cities
router.get('/get-countriesList', allCountries );
//=================City vehicle type association============================
// Route to create a vehicle-city association
router.post('/associate-vehicle-city', createVehicleCityAssociation);

// Route to get vehicle types by city
router.get('/vehicle-types/:cityId', VehicleTypesByCity);
//=============================authentication routes===========================
//sign up routes
router.post('/signup', user);
//login user
router.post('/login', loginUser);
//==============================user section routes=========================
//1. create new user
router.post('/user/create-user', createNewUser);
//2. get User
// router.get('/user/:id', searchUser)
//3. Get all users
router.get('/all-users', allUsers) 
//4. Update User
// router.patch('/user/upate-user', updateUser);
//5. delete User
// router.delete('/user/delete-user', deleteUser);
module.exports = router;
