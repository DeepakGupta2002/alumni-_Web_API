const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["alumni", "university_admin", "recruiter", "SuparAdmin"], required: true },
    universityname: { type: String },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false }, // ✅ New field
});
module.exports = mongoose.model("User", userSchema);
