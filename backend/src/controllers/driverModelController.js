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
     vehicleType} = req.body
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

const driversWithServiceAssigned = async (req, res) => {
try {
    const allDriversWithService = await DriverVehicleModel.find().populate("driverObjectId")
    if (!allDriversWithService) {
        return res.status(404).send({message:"Drivers not found with Services"})
    }
    res.status(200).send(allDriversWithService)
} catch (error) {
    res.status(500).send(error)
    }
}

const serviceDeleted = async (req, res) => {
    try {
        const _id = req.params.id;
        const serviceToBeDeleted = await DriverVehicleModel.findByIdAndDelete(_id)
        if (!serviceToBeDeleted) {
            return res.status(404).send("Service to be deleted not found")
        }
        res.status(200).send(serviceToBeDeleted)
    } catch (error) {
        res.status(500).send(error)
    }
}
const serviceUpdated = async (req, res) => {
    console.log("serviceUpdated: ", req.body._id)
    try {
        const service = req.body;
        const serviceId = service._id
        const serviceToBeUpdated = await DriverVehicleModel.findOne({ _id: serviceId });
        if (!serviceToBeUpdated) {
            return res.status(404).send("Service to be updated was not found");
        }
       //directly updating the data
        serviceToBeUpdated.basePrice=service.basePrice;
        serviceToBeUpdated.distanceForBasePrice=service.distanceForBasePrice;
        serviceToBeUpdated.driverProfit=service.driverProfit;
        serviceToBeUpdated.maxSpace=service.maxSpace;
        serviceToBeUpdated.minFare=service.minFare;
        serviceToBeUpdated.pricePerUnitDistance=service.pricePerUnitDistance;
        serviceToBeUpdated.pricePerUnitTime=service.pricePerUnitTime;
        serviceToBeUpdated.vehicleImageURL=service.vehicleImageURL;
        serviceToBeUpdated.vehicleType = service.vehicleType;
        console.log("servicetobe uPdated: ", serviceToBeUpdated)
        await serviceToBeUpdated.save();
        res.status(200).send(serviceToBeUpdated)
    } catch (error) {
        res.status(500).send(error)
    }
}
module.exports = { driverAssignedToVehicle,driversWithServiceAssigned, getSpecificDriver,serviceDeleted, driverList, serviceUpdated };