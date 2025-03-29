const express = require('express');
const cors = require('cors'); // CORS import kiya
const { router } = require('./src/routes/test');
// const authRoutes = require("./routes/authRoutes");
const { authrouter } = require('./src/routes/authRoutes');
const { default: mongoose } = require('./config/db');
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

app.use("/api", router);
app.use("/api/auth", authrouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
