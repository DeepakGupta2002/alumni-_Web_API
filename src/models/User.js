const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["alumni", "university_admin", "recruiter"], required: true },
    universityname: { type: String },
    otp: String,
    otpExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);
