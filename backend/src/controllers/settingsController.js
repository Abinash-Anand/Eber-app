const Settings = require('../models/settings')
const setSettings = async (req, res) => {
    try {
        const {id,numberOfStops,requestAcceptTime} = req.body
        const newSettings = new Settings({ id, requestAcceptTime,numberOfStops, })
        await newSettings.save();
        res.status(200).send(newSettings);
    } catch (error) {
        res.status(500).send(error)
    }
}

// settings.controller.js
const searchDefaultSettings = async (req, res) => {
    // console.log(req.params.id);
    try {
        // const id = req.params.id;
        const search = await Settings.find();
        if (!search) {
            return res.status(404).send("Settings not found");
        }
        res.status(200).send(search);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateSettings = async (req, res) => {
    try {
        console.log(req.body);
        const { id, requestAcceptTime, numberOfStops } = req.body;

        const defaultSettings = await Settings.findOne({ id })
        if (!defaultSettings) {
            return res.status(404).send(defaultSettings)
        }
        const newSettings = await defaultSettings.updateOne({
            requestAcceptTime: req.body.requestAcceptTime,
            numberOfStops: req.body.numberOfStops
        }, {new:true})
    

        console.log(newSettings);
        res.status(200).send(newSettings);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};


module.exports = {setSettings, searchDefaultSettings, updateSettings}