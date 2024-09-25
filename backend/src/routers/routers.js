// routers/routers.js
    const express = require('express');
    const router = express.Router();
    const { vehicleTypeController, vehicleData, updateVehicleData, getVehicleTypesByCity, vehicleTypechecking } = require('../controllers/vehicleTypeController');
    const upload = require('../config/multerConfig');
    const { addCountry, getCountries, singleCountry } = require('../controllers/countryController');
    const { addZone, allCities, allCountries, updateZoneCoords, zoneByCity } = require('../controllers/cityController');
    const { user, loginUser,loggedOutSessionTimer } = require('../controllers/signupController');
    const { createVehicleCityAssociation, VehicleTypesByCity } = require('../controllers/vehicleCityController');
    const { createNewUser, allUsersSortedAndpaginated, updateUser, deleteUser, searchUser } = require('../controllers/userController');
    const {
        createNewDriver,
        allDriverIfSortedInclude,
        updateDriver,
        deleteDriver,
        searchDriver,
        updateDriverServiceType,
        toggleDriverStatus,
        allDriversStatus,
    } = require('../controllers/driverController');
    const auth = require('../middlewares/authMiddleware');
    const { setPricing, getAllPricing , fetchAllPricingData, } = require('../controllers/pricingController')
    const {setSettings, searchDefaultSettings, updateSettings} = require('../controllers/settingsController')
    const { createNewPayment,fetchUserCardDetails, userStripeCards ,updateStripeAccount, deleteStripeCard, setCardToDefault, stripeCustomConnectedAccount} = require('../controllers/stripePayment');
    const { createNewRide, deleteRideFromRides } = require('../controllers/createRideController')
    const { ensureAuthenticated } = require('../middlewares/authMiddleware');
    const { getConfirmedRides, updateRideStatus, cancelRide } = require('../controllers/confirmRideController')
    const { assignedDriver } = require('../controllers/driverAssignedRide');
    const { driverAssignedToVehicle, getSpecificDriver, driverList,
    driversWithServiceAssigned, serviceDeleted, serviceUpdated } = require('../controllers/driverModelController')
    const { rideBooked, getAllAcceptedRides, assignDriver, reassignRequest, rideRejectedByDriver } = require('../controllers/bookedRidesController')
    const {updateBookingStatus,calculateInvoice,submitFeedback} = require('../controllers/tripController');
    const {rideHistory, filteredHistory, searchHistory} = require('../controllers/rideHistoryController')
    const { sendWelcomeEmail, sendInvoiceEmail } = require('../controllers/nodemailer');
    const {driverBankAccount} = require('../controllers/driverBankAccount')
    const {handleSubscription} = require('../controllers/pushNotification')
    
    // Route to get the data from the vehicle type form
    
    router.post('/submit-vehicle-type', upload.single('vehicleImage'), vehicleTypeController);
    // Route to get the vehicle data from server
    router.get('/req-vehicle-data', vehicleData);
    //Checking if the vehicle type already exists or not
    router.get('/pricing/vehicles-type/check/:id', vehicleTypechecking)
    // Route to update the vehicle data
    router.patch('/update-vehicle-data/:id',upload.single('image'), updateVehicleData);

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
     //update zone data
    router.patch('/city/update/zone',  updateZoneCoords)
    //get specific zone by city name
router.get('/cities/specific-zone', zoneByCity);

    //=================City vehicle type association============================
    // Route to create a vehicle-city association
    router.post('/associate-vehicle-city', createVehicleCityAssociation);

    // Route to get vehicle types by city
    router.get('/vehicle-types/:cityId', VehicleTypesByCity);

   
    //=============================authentication routes===========================
    //sign up routes
    router.post('/signup', user);
    //login user
    router.post('/login', (req,res)=>loginUser(req,res,req.app.get('socketio')));
    router.post('/auth/logout/session', loggedOutSessionTimer)
    //==============================user section routes=========================
    //1. create new user
    router.post('/user/create-user', createNewUser);
    //2. get User
    router.get('/user/specific-user', searchUser);
    //3. Get all users
    router.get('/all-users', allUsersSortedAndpaginated);
    //4. Update User
    router.patch('/user/update-user', updateUser);
    //5. delete User
    router.delete('/user/delete-user/:id', deleteUser);
//6. Get sorted users
    router.get('/users/sorted-table/all-users', allUsersSortedAndpaginated)
    //==============================Driver section routes=========================
    //1. create new user
    router.post('/driver/create-driver', createNewDriver);
    //2. get User
    router.get('/driver/specific-driver', searchDriver);
    //3. Get all users
    router.get('/all-drivers', allDriverIfSortedInclude);
    //4. Update User
    router.patch('/driver/update-driver', updateDriver);
    //5. delete User
    router.delete('/driver/delete-driver/:id', deleteDriver);
    //6. sorting table
    router.get('/drivers/sorted-table/all-drivers', allDriverIfSortedInclude)
    // New routes for updating service type and toggling status
    router.patch('/driver/update-service-type', updateDriverServiceType);
    router.patch('/driver/toggle-status', toggleDriverStatus);
    router.get('/all-drivers/status', allDriversStatus)

    //----Assigning driver to vehicle---------------------
    router.post('/assign/vehicle', driverAssignedToVehicle)
    router.get('/get/driverObject/:id', getSpecificDriver)
    router.get('/get/drivers', driverList)
    router.get('/pricing/driver/assigned/service', driversWithServiceAssigned)
    router.patch('/pricing/driver/assigned/service/update/:id', serviceUpdated)
    router.delete('/pricing/driver/assigned/service/delete/:id', serviceDeleted)
    //----------------------Driver Running requests------------------------------
    router.get('/api/assigned-requests', getAllAcceptedRides)
    router.patch('/api/cancel-request/:id', (req, res) => rideRejectedByDriver(req, res, req.app.get('socketio')))
    router.delete('/api/cancel-request/rides/delete/:id', cancelRide)
//-----------------------driver bank account---------------------------------
    router.post('/driver/create/bank_account/:id', driverBankAccount)
    //--------------------------Setting Pricing Routes--------------------------------
    //1.Post 
    router.post('/submit-pricing', setPricing);
    router.get('/get-pricing-data', getAllPricing);
    router.get('/fetch/pricing-data', fetchAllPricingData)
    //-----------------------------Setting Settings of the App------------------------
    router.post('/set-settings', setSettings);
    router.get('/check-settings', searchDefaultSettings);
    router.patch('/update-settings', updateSettings);
    //------------------------------Stripe payment gateway------------------------------
    router.post('/create-payment-intent', createNewPayment);
    router.get('/fetch-all-cards/:id', fetchUserCardDetails);
    router.get('/stripe/cards/user-cards/:id', userStripeCards);
    router.delete('/stripe/cards/delete-one/:id', deleteStripeCard)
    router.patch('/stripe/cards/update/make-default',setCardToDefault)
    router.post('/driver/stripe/create/express/account', stripeCustomConnectedAccount)
    router.patch('/update-stripe-account', updateStripeAccount);
    //------------------------------Create Rides Section--------------------------------
    router.post('/book-ride', (req, res) => createNewRide(req, res, req.app.get('socketio')));

    //-------------------------------Confirm Ride Section-------------------------------
    router.get('/confirmed-rides', getConfirmedRides); // -corouter.post('/api/reassign-request/', reassignRequest);nfirmed ride
    router.patch('/update-ride-status/:id', updateRideStatus);
    router.patch('/cancel-ride/:id', cancelRide); // - cancel ride

    //-------------------------------Assign Driver socket connections----------------------
    router.post('/driver-assigned', (req, res) => assignedDriver(req, res, req.app.get('socketio')));
    //-------------------------------Confirm Ride Booking-----------------------------------
    router.post('/create/new/ride-booking', (req, res) => rideBooked(req, res, req.app.get('socketio')));
    router.get('/ride-bookings/accepted-rides', getAllAcceptedRides)
    router.patch('/api/accept-request/:id',(req,res)=> assignDriver (req,res,req.app.get('socketio')))
    router.post('/api/reassign-request/', reassignRequest);
    //-----------------------------Trip Progress API's--------------------------------------
    // Route to update booking status
    router.patch('/update-status',(req, res)=>updateBookingStatus(req,res,req.app.get('socketio')));

    // Route to calculate invoice
    router.post('/calculate-invoice/:id', calculateInvoice);

    // Route to submit feedback
router.post('/submit-feedback', submitFeedback);
    
//--------------------- Ride History---------------------------------
router.get('/rides/ride-history', rideHistory);
router.get('/history/filter-type/:id', filteredHistory)
router.get('/history/search-history/:keyword', searchHistory)

//-------------------------Nodemailer------------------------------
// // Route to send a welcome email
// router.post('/send-welcome-email', sendWelcomeEmail);

// // Route to send an invoice email
// router.post('/send-invoice-email', sendInvoiceEmail);
//==============================PUSH NOTIFICATIONS==============================
// router.post('/subscribe', pushNotification)
router.post('/subscribe', handleSubscription)

module.exports = router;
