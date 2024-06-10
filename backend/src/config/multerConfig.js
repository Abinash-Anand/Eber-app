const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Changed 'Data' to 'Date'
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique file names
    }
});

const upload = multer({ storage: storage });
module.exports = upload;
