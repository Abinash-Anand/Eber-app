const zoneModel = require('../models/cityModel');
const { cityModel } = require('../models/modelPackage');

//post request to store zone data
const addZone = async (req, res) => {
    try {
            // console.log(req.body);
    const zoneObject = new zoneModel({
        countryId: req.body.id,
        country: req.body.country,
        city: req.body.city,
        latLngCoords: req.body.latLngCoords
    })
        console.log(zoneObject);
        
        await zoneObject.save()
    res.status(201).send(zoneObject)
    } catch (error) {
        res.status(500).send(error)
    }

}

//get all cities
const allCities = async (req, res) => {
    
    console.log("city: ", req.params.id);
    try {
        const countryId = req.params.id
        const zones = await cityModel.find({ countryId: countryId })
        console.log(zones);
    res.status(200).send(zones)
        
    } catch (error) {
        res.status(500).send({message: 'Internal Server issue', error})
    }
    
}

const allCountries = async (req, res) => {
    
    // console.log("city: ", req.params.id);
    try {
        const countryList = await cityModel.find()
    res.status(200).send(countryList)
        
    } catch (error) {
        res.status(500).send({message: 'Internal Server issue', error})
    }
    
}
const updateZoneCoords = async (req, res) => {
    try {
        const zoneData = req.body
        console.log("zoneData: ", zoneData)
        const id = zoneData.cityId

    const city = await zoneModel.findByIdAndUpdate({_id: id})
        // console.log("database city: ", city)

        if (!city) {
        return res.status(404).send("City not found!")
        }
        // console.log('latlngcoords: ',city.latLngCoords)
    city.latLngCoords = zoneData.city.latLngCoords
    await city.save()
    res.status(200).send(city)
} catch (error) {
    res.status(500).send(error)
}

}
const zoneByCity = async (req, res) => {
    console.log(req.query);  // Use req.query for query parameters

    try {
        const cityName = req.query.cityName;  // Extract city name from query

        const cities = await zoneModel.find();
        const zone = cities.filter((city) => {
            return cityName.includes(city.city);  // Adjust logic as needed
        });

        console.log("Zone: ", zone);
        res.status(200).send(zone);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
module.exports = {addZone, allCities, allCountries, updateZoneCoords, zoneByCity};