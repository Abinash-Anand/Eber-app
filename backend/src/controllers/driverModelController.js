const DriverVehicleModel = require('../models/driverVehiclePricingModel');
// 1. Driver Assigned to vehicle
const driverAssignedToVehicle = async (req, res) => {
    try {
        /* 
         [city: id, country: id, driverObjectId: id, basePrice, distanceForBasePrice,
    driverProfit, maxSpace, minFare, pricePerUnitDistance, pricePerUnitTime, vehicleImageURL,
    vehicleName, vehicleType]
        */
        const {city, country, driverObjectId, basePrice, distanceForBasePrice,
    driverProfit, maxSpace, minFare, pricePerUnitDistance, pricePerUnitTime, vehicleImageURL,
    vehicleName, vehicleType} = req.body
        const newDriverVehicle = new DriverVehicleModel({
            city:city._id,
            country:country._id,
            driverObjectId:driverObjectId,
            basePrice,
            distanceForBasePrice,
            driverProfit,
            maxSpace,
            minFare,
            pricePerUnitDistance,
            pricePerUnitTime,
            vehicleImageURL,
            // vehicleName,
            vehicleType
        })
        console.log("Driver<=>Vehicle: ", newDriverVehicle)
        await newDriverVehicle.save();
        //===========creating driver's connected custom account
     
    res.status(201).send({ message: "Driver assigned to vehicle!", newDriverVehicle });
    
  } catch (error) {
    res.status(500).send(error)
  }
}
const getSpecificDriver = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("getSpecificDriver: ",id);
        
        // Query by driverObjectId
        const driver = await DriverVehicleModel.findOne({ driverObjectId: id });
        console.log("getSpecificDriver Driver: ",driver);
        
        if (!driver) {
            return res.status(404).send({ message: "Driver Not found!" });
        }
        
        res.status(200).send(driver);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Internal Server Error", error });
    }
};
const driverList = async (req, res) => {
    try {
        
        
        const drivers = await DriverVehicleModel.find().populate('driverObjectId').populate('country').populate('city');
        console.log(drivers);
        
        if (!drivers) {
            return res.status(404).send({ message: "Driver Not found!" });
        }
        
        res.status(200).send(drivers);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Internal Server Error", error });
    }
};
module.exports = { driverAssignedToVehicle, getSpecificDriver, driverList };