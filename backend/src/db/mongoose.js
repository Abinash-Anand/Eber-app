const mongoose = require("mongoose");
require('dotenv')
mongoose.connect('mongodb://localhost:27017/')
const db = mongoose.connect
console.log("Database Connection Established📚, connected to EberDatabase", db);