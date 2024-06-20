const zoneModel = require('../models/cityModel');
const { cityModel } = require('../models/modelPackage');

//post request to store zone data
const addZone = async (req, res) => {
    try {
            // console.log(req.body);
    const zoneObject = new zoneModel({
        countryId: req.body.id,
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

    try {
    const zones = await cityModel.find()
    res.status(200).send(zones)
        
    } catch (error) {
        res.status(500).send({message: 'Internal Server issue', error})
    }
    
}
module.exports = {addZone, allCities};