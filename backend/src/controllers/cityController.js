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
module.exports = {addZone, allCities, allCountries};