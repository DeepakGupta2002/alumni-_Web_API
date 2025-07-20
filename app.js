const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // ✅ Rate limiter import
const { router } = require('./src/routes/test');
const { authrouter } = require('./src/routes/authRoutes');
const { default: mongoose } = require('./config/db');
const { InstituteRouter } = require('./src/routes/Institute.js/Institute');
const { RecruiterRouter } = require('./src/routes/recuriter/recuriter');
const { alumniProfileRouter } = require('./src/routes/alumniProfileRoutes');
const { postRouter } = require('./src/routes/postRoutes');
const { AlumaiRecordRouter } = require('./src/routes/alumniRecord');

require("dotenv/config");

const app = express();

// ✅ Global Rate Limiter (100 requests per 15 min)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

// ✅ Auth Route Specific Rate Limiter (10 requests per 10 min)
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10,
    message: "Too many login/signup attempts. Please try again after 10 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

// ✅ Apply Global Rate Limiter
app.use(globalLimiter);

// ✅ CORS Setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Body Parser & File Static Folder
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

// ✅ Apply Routes
app.use("/api", router);
app.use("/api/auth", authLimiter, authrouter); // Auth route with custom rate limit
app.use("/api", InstituteRouter);
app.use("/api", RecruiterRouter);
app.use("/api", alumniProfileRouter);
app.use("/api/post", postRouter);
app.use("/api/alumni-record", AlumaiRecordRouter);

// ✅ Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
