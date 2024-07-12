const mongoose = require('mongoose');
const settingSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    numberOfStops: {
        type: Number,
        required:true,
    },
    requestAcceptTime: {
        type: Number,
        required:true,
}
})
const Settings = mongoose.model('Settings', settingSchema);
module.exports = Settings