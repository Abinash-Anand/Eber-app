const { vehicleTypeModel } = require('../models/modelPackage'); // Ensure this path is correct

const vehicleTypeController = async (req, res) => {
    try {
        const vehicleType = new vehicleTypeModel({
            vehicleName: req.body.vehicleName,
            vehicleType: req.body.vehicleType,
            vehicleImage: {
                fileName: req.file.filename, // Changed 'fileName' to 'filename'
                filePath: req.file.path,
                fileSize: req.file.size,
                fileType: req.file.mimetype
            }
        });

        console.log("Controller output: ", vehicleType);
        await vehicleType.save();
        res.status(200).json({ message: 'Vehicle type added successfully', vehicleType });

    } catch (error) {
        res.status(500).json({ message: "Error adding the vehicle type: ", error });
    }
};

module.exports = { vehicleTypeController };
