const mongoose = require("mongoose");

const AlumniProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName: { type: String, required: true },
        dob: { type: Date, required: true },
        email: { type: String },
        mobile: { type: String, required: true },
        address: String,
        courseName: { type: String, required: true },
        college: { type: String },
        departmentName: String,
        passingYear: Number,
        currentJob: String,
        companyName: String,
        designation: String,
        jobLocation: String,
        enrollment: { type: String },
        experience: Number,
        marksheetUrl: String,
        photoUrl: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("AlumniProfile", AlumniProfileSchema);
