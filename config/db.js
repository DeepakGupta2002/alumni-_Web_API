
const mongoose = require('mongoose');
require("dotenv/config");

// MongoDB URL
const mongoDBURL = 'mongodb://localhost:27017/AlumaniZone';

// Connect to MongoDB
mongoose.connect(mongoDBURL, {

}).then(() => {
    console.log('Connected to MongoDB successfully!');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});

module.exports = { mongoose }


// require("dotenv/config");
// const mongoose = require("mongoose");

// const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.yupixxr.mongodb.net/AlmuniZone?retryWrites=true&w=majority`;

// mongoose.connect(mongoURI)
//     .then(() => console.log("✅ Connected to MongoDB database AlmuniZone"))
//     .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

// module.exports = mongoose;
