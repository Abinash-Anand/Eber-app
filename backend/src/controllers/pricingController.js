const Pricing = require('../models/pricingModel')

const setPricing = async (req, res) => {
    console.log(req.body); 
    try {
        const {
            country,
            city,
            vehicleType,
            driverProfit,
            minFare,
            distanceForBasePrice,
            basePrice,
            pricePerUnitDistance,
            pricePerUnitTime,
            maxSpace,
        } = req.body
        const newPricing = new Pricing({
            country,
            city,
            vehicleType,
            driverProfit,
            minFare,
            distanceForBasePrice,
            basePrice,
            pricePerUnitDistance,
            pricePerUnitTime,
            maxSpace,
        })
        await newPricing.save()
        res.status(200).send(newPricing);

        } catch (error) {
        res.status(500).send(error)
    }
}
const getAllPricing = async (req, res) => {
 try {
       const PricingData = await Pricing.find();
    if (PricingData.length === 0) {
        return res.status(404).send({message:"Pricing Data Not found",PricingData})
    }
    res.status(200).send(PricingData);
 } catch (error) {
    res.status(500).send(error)
 }
}

module.exports = {setPricing, getAllPricing}