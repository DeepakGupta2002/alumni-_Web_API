const express = require("express");
const { register, verifyOtp, login } = require("../controllers/authController");
const { verifyToken, checkRole } = require("../midilehere/authMiddleware");
const { getUserProfile, getSuperAdminProfile } = require("../controllers/userProfile");
const authrouter = express.Router();
authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.post("/verify-otp", verifyOtp);


// authrouter.get("/profile", verifyToken, (req, res) => {
//     res.json({ message: "Profile Data", user: req.user });
// });

// 🔹 Protected route for Alumni only
authrouter.get("/alumni-dashboard", verifyToken, checkRole(["alumni"]), (req, res) => {
    res.json({ message: "Welcome Alumni!", user: req.user });
});

// 🔹 Protected route for University Admins only
authrouter.get("/university-dashboard", verifyToken, checkRole(["university_admin"]), (req, res) => {
    res.json({ message: "Welcome University Admin!", user: req.user });
});

// 🔹 Protected route for Recruiters only
authrouter.get("/recruiter-dashboard", verifyToken, checkRole(["recruiter"]), (req, res) => {
    res.json({ message: "Welcome Recruiter!", user: req.user });
});

authrouter.get("/profile", verifyToken, getUserProfile);
// 
authrouter.get("/superadmin/me", verifyToken, getSuperAdminProfile);
module.exports = { authrouter };
