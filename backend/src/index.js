const express = require("express");
const app = express();
const port = process.env.PORT || 5000; // Corrected 'Port' to 'PORT'
const routers = require('./routers/routers'); // Ensure this path is correct
require('./db/mongoose')
// Middleware to parse JSON bodies
app.use(express.json()); // Added middleware to parse <JSON></JSON>

app.use(routers);

app.listen(port, () => {
    console.log("The server is live at port: ", port);
});
