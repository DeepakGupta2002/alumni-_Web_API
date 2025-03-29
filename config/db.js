// const mongoose = require('mongoose');

// // MongoDB URL
// const mongoDBURL = 'mongodb://localhost:27017/ITWorldhub';

// // Connect to MongoDB
// mongoose.connect(mongoDBURL, {

// }).then(() => {
//     console.log('Connected to MongoDB successfully!');
// }).catch((error) => {
//     console.log('Error connecting to MongoDB:', error);
// });

// module.exports = { mongoose }

require("dotenv/config");
const mongoose = require("mongoose");

// console.log(process.env.DB_PASSWORD)
// MongoDB connection string with ITworldhub as the database name
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.yupixxr.mongodb.net/AlmuniZone`)
    .then(() => {
        console.log("Connected to MongoDB database AlmuniZone");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

module.exports = mongoose;
