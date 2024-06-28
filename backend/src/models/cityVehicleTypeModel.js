const mongoose = require('mongoose');

const vehicleCityAssociationSchema = new mongoose.Schema({
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City', // Assuming you have a City model
        required: true
    },
    vehicleTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VehicleType', // Assuming you have a VehicleType model
        required: true
    }
});

const VehicleCityAssociation = mongoose.model('VehicleCityAssociation', vehicleCityAssociationSchema);
module.exports = VehicleCityAssociation;
