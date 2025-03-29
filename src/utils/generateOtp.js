const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();  // Ensure environment variables are loaded

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // Secure for port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send OTP
const sendOTP = async (email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await User.findOneAndUpdate({ email }, { otp, otpExpiry });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Ensure this is set correctly
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully to:", email);
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
};

module.exports = sendOTP;
