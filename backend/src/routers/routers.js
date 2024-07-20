const express = require('express');
const router = express.Router();
const { vehicleTypeController, vehicleData, updateVehicleData, getVehicleTypesByCity } = require('../controllers/vehicleTypeController');
const upload = require('../config/multerConfig');
const { addCountry, getCountries, singleCountry } = require('../controllers/countryController');
const { addZone, allCities, allCountries } = require('../controllers/cityController');
const { user, loginUser } = require('../controllers/signupController');
const { createVehicleCityAssociation, VehicleTypesByCity } = require('../controllers/vehicleCityController');
const { createNewUser, allUsers, updateUser, deleteUser, searchUser } = require('../controllers/userController');
const { createNewDriver, allDrivers, updateDriver, deleteDriver, searchDriver } = require('../controllers/driverController');
const auth = require('../middlewares/authMiddleware');
const { setPricing, getAllPricing } = require('../controllers/pricingController')
const {setSettings, searchDefaultSettings, updateSettings} = require('../controllers/settingsController')
const { createNewPayment,fetchUserCardDetails } = require('../controllers/stripePayment');
const { createNewRide } = require('../controllers/createRideController')
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const {confirmedRide, updateRideStatus,assignDriverToRide, cancelRide, filterRide}= require('../controllers/confirmRideController')
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
router.get('/get-countriesList', allCountries);
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
router.get('/user/specific-user', searchUser);
//3. Get all users
router.get('/all-users', allUsers);
//4. Update User
router.patch('/user/update-user', updateUser);
//5. delete User
router.delete('/user/delete-user/:id', deleteUser);

//==============================Driver section routes=========================
//1. create new user
router.post('/driver/create-driver', createNewDriver);
//2. get User
router.get('/driver/specific-driver', searchDriver);
//3. Get all users
router.get('/all-drivers', allDrivers);
//4. Update User
router.patch('/driver/update-driver', updateDriver);
//5. delete User
router.delete('/driver/delete-driver/:id', deleteDriver);

//--------------------------Setting Pricing Routes--------------------------------
//1.Post 
router.post('/submit-pricing', setPricing);
router.get('/get-pricing-data', getAllPricing)
//-----------------------------Setting Settings of the App------------------------
router.post('/set-settings', setSettings)
router.get('/check-settings', searchDefaultSettings);
router.patch('/update-settings', updateSettings)
//------------------------------Stripe payment gateway------------------------------
router.post('/create-payment-intent', createNewPayment)
router.get('/fetch-all-cards/:id', fetchUserCardDetails)
//------------------------------Create Rides Section--------------------------------
router.post('/book-ride', createNewRide)
//-------------------------------Confirm Ride Section-------------------------------
    router.get('/confirmed-rides',  confirmedRide)// -confirmed ride
    router.put('/ride-status/:id',  updateRideStatus ) //-update ride status
    router.put('/assign-driver/:id',  assignDriverToRide)// - assign driver to ride
    router.delete('/cancel-ride/:id',  cancelRide)// - cancel ride
    router.get('/filter-rides',  filterRide) //- filter ride
// {confirmedRide, updateRideStatus,assignDriverToRide, cancelRide, filterRide}
module.exports = router;
