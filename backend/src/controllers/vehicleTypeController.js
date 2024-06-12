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

const vehicleData = async (req, res) => {
  try {
    const vehicles = await vehicleTypeModel.find();

    // Map each vehicle to include the image URL
    const vehiclesWithImageURLs = vehicles.map(vehicle => ({
      ...vehicle.toObject(),
      vehicleImageURL: `http://localhost:5000/uploads/${vehicle.vehicleImage.fileName}`
    }));

    // Send the modified vehicle data with image URLs in the response
    res.status(200).json({ message: "Vehicle data received!", vehicles: vehiclesWithImageURLs });
  } catch (error) {
    res.status(500).json({ message: "Vehicle data not found!", error });
  }
};

// Update vehicle data by ID
// Update vehicle data by ID
const updateVehicleData = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const updateData = req.body;
    let updateFields = {};

    if (updateData.name) {
      updateFields.vehicleName = updateData.name;
    }
    if (updateData.type) {
      updateFields.vehicleType = updateData.type;
    }
    console.log('Received file:', req.file);
    if (req.file) {
      // Log file information
     
      updateFields.vehicleImage = {
        fileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      };
    }
    
    const vehicle = await vehicleTypeModel.findByIdAndUpdate(vehicleId, updateFields, { new: true });

    if (!vehicle) {
      return res.status(404).send('Vehicle not found');
    }

    res.status(200).send(vehicle);
  } catch (error) {
    console.error('Error updating vehicle data:', error); // Log the error to the console
    res.status(500).send('Error updating vehicle data: ' + error.message);
  } 
};
 



module.exports = { vehicleTypeController, vehicleData, updateVehicleData };