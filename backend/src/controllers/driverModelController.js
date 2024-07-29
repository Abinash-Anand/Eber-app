const DriverVehicleModel = require('../models/driverVehiclePricingModel');

// 1. Driver Assigned to vehicle
const driverAssignedToVehicle = async (req, res) => {
    try {
    const newDriverVehicle = new DriverVehicleModel(req.body)
    await newDriverVehicle.save();
    res.status(201).send({ message: "Driver assigned to vehicle!", newDriverVehicle });
    
  } catch (error) {
    res.status(500).send(error)
  }
}
const getSpecificDriver = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        
        // Query by driverObjectId
        const driver = await DriverVehicleModel.findOne({ driverObjectId: id });
        console.log(driver);
        
        if (!driver) {
            return res.status(404).send({ message: "Driver Not found!" });
        }
        
        res.status(200).send(driver);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send({ message: "Internal Server Error", error });
    }
};
module.exports = { driverAssignedToVehicle, getSpecificDriver };