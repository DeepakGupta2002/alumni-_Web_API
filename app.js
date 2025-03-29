const express = require('express');
const cors = require('cors'); // CORS import kiya
const { router } = require('./src/routes/test');
const { connectDB } = require('./config/db');
// const authRoutes = require("./routes/authRoutes");
const { authrouter } = require('./src/routes/authRoutes');
require("dotenv/config")
const app = express();

// CORS Middleware
app.use(cors({
    origin: '*', // Sabhi origins allow karne ke liye
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware for JSON requests
app.use(express.json());

connectDB();
app.use("/api", router);
app.use("/api/auth", authrouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
