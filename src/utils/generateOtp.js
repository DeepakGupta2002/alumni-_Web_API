const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendOTP = async (email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findOneAndUpdate({ email }, { otp, otpExpiry });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
