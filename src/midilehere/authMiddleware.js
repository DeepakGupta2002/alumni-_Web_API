const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "your_jwt_secret_key"; // Replace with a strong secret key

// 🔹 1️⃣ Middleware to Verify JWT Token
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided!" });
        }

        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-otp -otpExpiry");

        if (!req.user) {
            return res.status(401).json({ message: "User not found!" });
        }

        next(); // ✅ Token valid, proceed to next middleware or route
    } catch (error) {
        console.error("Token Error:", error);
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

// 🔹 2️⃣ Middleware for Role-Based Access
exports.checkRole = (roles) => {
    // console.log(req.body)
    // console.log(roles)
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied! Insufficient Permissions" });
        }
        next(); // ✅ Role matched, proceed
    };
};
