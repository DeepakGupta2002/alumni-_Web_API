const User = require("../models/User");
const sendOTP = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // Replace with strong secret

// 🔹 1️⃣ Register User & Send OTP
exports.register = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: "User already registered and verified. Please login." });
        }

        if (!user) {
            user = new User({ name, email, role });
        } else {
            user.name = name;
            user.role = role;
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        user.isVerified = false; // Reset verification on re-register

        await user.save();
        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 🔹 2️⃣ Login (Send OTP to Verified User's Email)
exports.login = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before login." });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await user.save();
        await sendOTP(email, otp);

        res.json({ message: "OTP sent for login verification" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 🔹 3️⃣ Verify OTP & Generate JWT Token
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "Invalid or Expired OTP" });
        }

        // Reset OTP fields and mark as verified
        user.otp = null;
        user.otpExpiry = null;
        user.isVerified = true;
        await user.save();

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login Successful", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
