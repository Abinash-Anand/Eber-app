const { vehicleTypeModel } = require('../models/modelPackage'); // Ensure this path is correct
const fs = require('fs'); // Import the File System module for file operations
const Pricing = require('../models/pricingModel')
const vehicleTypeController = async (req, res) => {
  
  try {
    const lowercaseVehicleName = req.body.vehicleName
    const firstLetterUpperCaseVehicleName = lowercaseVehicleName.charAt(0).toUpperCase()
      + lowercaseVehicleName.slice(1)
        const vehicleType = new vehicleTypeModel({
            vehicleType: firstLetterUpperCaseVehicleName,
            // vehicleType: req.body.vehicleType,
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
  console.log("updateVehicleData: ", req.body); // Log incoming request data

  try {
    const vehicleId = req.params.id; // Get the vehicle ID from the request parameters
    let updateFields = {}; // Initialize an object to hold update fields
    
    // Fetch the current vehicle data to retrieve the old image path
    const vehicle = await vehicleTypeModel.findById(vehicleId);

    console.log("vehicle: ",vehicle.vehicleType)
    // const firstLetterUpperCase =  vehicle.vehicletype.charAt(0).toUpperCase() + vehicle.vehicletype.slice(1)  

    const pricingUpdate =  await Pricing.findOne({});
    if (!vehicle) {
      return res.status(404).send('Vehicle not found'); // Check if the vehicle exists
    }
    console.log("Pricing: ", pricingUpdate)
    if (!pricingUpdate) {
      console.error("Pricing model do not exists for this vehicleType")
    } 
      pricingUpdate.vehicleType = req.body.type;
     await pricingUpdate.save();
      console.log("updated Pricing: ", pricingUpdate)
     // Update the vehicle type if provided in the request body
    if (req.body.type) {
       console.log("Update type: ", req.body.type)
       updateFields.vehicleType = req.body.type; // Set the new vehicle type
      
    }

    // Handle the vehicle image upload, if provided
    if (req.file) {
      console.log('Received file:', req.file); // Log file information

      // Delete the old image if it exists
      if (vehicle.vehicleImage && vehicle.vehicleImage.filePath) {
        fs.unlink(vehicle.vehicleImage.filePath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err); // Log any errors during deletion
          } else {
            console.log('Old image deleted successfully'); // Log success message
          }
        });
      }

      // Set the new image details
      updateFields.vehicleImage = {
        fileName: req.file.filename, // Use 'filename' as set by multer
        filePath: req.file.path,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      };
    }

    // Update the vehicle document in the database
    const updatedVehicle = await vehicleTypeModel.findByIdAndUpdate(vehicleId, updateFields, { new: true });
  
    if (!updatedVehicle) {
      return res.status(404).send('Vehicle not found'); // Handle case where vehicle update fails
    }
    // Return the updated vehicle data with a success message
    res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });

  } catch (error) {
    console.error('Error updating vehicle data:', error); // Log any errors
    res.status(500).json({ message: 'Error updating vehicle data: ' + error.message }); // Send error response
  }
};

 
// Controller method to get vehicle types by city
const getVehicleTypesByCity = async (req, res) => {
    try {
        const cityId = req.params.cityId;
        const vehicleTypes = await vehicleTypeModel.find({ cityId: cityId });

        if (!vehicleTypes) {
            return res.status(404).send('No vehicle types found for this city');
        }

        res.status(200).json(vehicleTypes);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving vehicle types: ", error });
    }
};
const vehicleTypechecking = async (req, res) => {
  try {
    const searchValue = req.params.id
    const firstLetterUpperCase =  searchValue.charAt(0).toUpperCase() + searchValue.slice(1)  
    const vehicleType = await vehicleTypeModel.findOne({ vehicleType: firstLetterUpperCase })
    if (!vehicleType) {
      return res.status(404).send("Vehicle Type Not found")
    }
    res.status(200).send(vehicleType)
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = {vehicleTypechecking, vehicleTypeController, vehicleData, updateVehicleData, getVehicleTypesByCity };