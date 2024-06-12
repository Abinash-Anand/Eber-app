// controllers/countryController.js
const Country = require('../models/countryModel');

const addCountry = async (req, res) => {
    console.log(req.body);
  try {
    const { name, currency, countryCallingCode, countryCode, flag, timeZone } = req.body;

    const newCountry = new Country({
      name,
      currency,
      countryCallingCode,
      countryCode,
      flag,
      timeZone
    });

    await newCountry.save();
    res.status(201).send(newCountry);
  } catch (error) {
    console.error('Error adding country:', error);
    res.status(500).json({ message: 'Error adding country', error });
  }
};

//get request for country data
const getCountries = async(req, res) => {
    console.log(res.body);
    try {
        const allCountry = await Country.find();
        if (!allCountry) {
            res.status(404).json({message: "Country Data not found!"})
        }
        res.status(200).send(allCountry)
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error})
    }
}

//get single country 
const singleCountry = async (req, res)=>{
    try {
        console.log("id value: ",req.params.id);
        const id = req.params.id
        const countryObject = await Country.findOne({countryCode: id});
        console.log(countryObject);
        res.status(200).send(countryObject)
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error})
    }
}


module.exports = { addCountry, getCountries, singleCountry };
