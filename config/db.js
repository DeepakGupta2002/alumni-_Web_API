require("dotenv/config");
const mongoose = require("mongoose");

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.yupixxr.mongodb.net/AlmuniZone?retryWrites=true&w=majority`;

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB database AlmuniZone"))
    .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

module.exports = mongoose;
