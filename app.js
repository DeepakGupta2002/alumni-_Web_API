const express = require('express');
const cors = require('cors'); // CORS import kiya
const { router } = require('./src/routes/test');
// const authRoutes = require("./routes/authRoutes");
const { authrouter } = require('./src/routes/authRoutes');
const { default: mongoose } = require('./config/db');
const { InstituteRouter } = require('./src/routes/Institute.js/Institute');
const { RecruiterRouter } = require('./src/routes/recuriter/recuriter');
const { alumniProfileRouter } = require('./src/routes/alumniProfileRoutes');
const { postRouter } = require('./src/routes/postRoutes');
const { AlumaiRecord, AlumaiRecordRouter } = require('./src/routes/alumniRecord');
// const mongoose = require("mongoose");
require("dotenv/config")
const app = express();
// mongoose();
// CORS Middleware
app.use(cors({
    origin: '*', // Sabhi origins allow karne ke liye
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware for JSON requests
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use(express.urlencoded({ extended: true })); // URL encoded requests
app.use("/api", router);
app.use("/api/auth", authrouter);

// InstituteRouter api for register 
app.use('/api', InstituteRouter);
// RecruiterRouter api
app.use('/api', RecruiterRouter)

// alumniProfileRouter api
app.use("/api", alumniProfileRouter)

// post  api
app.use('/api/post', postRouter);

// AlumaiRecord verification pupose
app.use("/api/alumni-record", AlumaiRecordRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
