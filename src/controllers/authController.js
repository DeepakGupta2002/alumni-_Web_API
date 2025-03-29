const User = require("../models/User");
const sendOTP = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // 🔹 Replace with a strong secret key

// 🔹 1️⃣ Register User & Send OTP
exports.register = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ name, email, role });
            await user.save();
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 min

        await user.save();
        await sendOTP(email, otp);

        res.json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// 🔹 2️⃣ Login (Send OTP to User's Email)
exports.login = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 min

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

        // Reset OTP fields
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // 🔹 Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" } // Token expires in 7 days
        );

        res.json({ message: "Login Successful", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
