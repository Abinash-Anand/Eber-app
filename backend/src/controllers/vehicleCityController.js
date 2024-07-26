const VehicleCityAssociation = require('../models/cityVehicleTypeModel'); // Ensure this path is correct

// Controller to create a new vehicle-city association
const createVehicleCityAssociation = async (req, res) => {
    try {
        const { cityId, vehicleTypeId } = req.body;
        
        const association = new VehicleCityAssociation({
            cityId: cityId,
            vehicleTypeId: vehicleTypeId
        });

        await association.save();
        res.status(200).json({ message: 'Vehicle type associated with city successfully', association });
    } catch (error) {
        res.status(500).json({ message: "Error associating vehicle type with city: ", error });
    }
};

// Controller to get vehicle types by city
const VehicleTypesByCity = async (req, res) => {
    try {
        const cityId = req.params.cityId;
        const associations = await VehicleCityAssociation.find({ cityId: cityId }).populate('vehicleTypeId');

        if (!associations) {
            return res.status(404).send('No vehicle types found for this city');
        }

        res.status(200).json(associations.map(assoc => assoc.vehicleTypeId));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving vehicle types: ", error });
    }
};

module.exports = { createVehicleCityAssociation, VehicleTypesByCity };
