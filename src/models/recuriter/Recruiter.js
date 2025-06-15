const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming your user model is named 'User'
        required: true,
    },

    recruiterName: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    company: {
        name: {
            type: String,
            required: true,
        },
        website: {
            type: String,
        },
        address: {
            type: String,
        },
        logo: {
            type: String,
        },
    },

    jobDetails: {
        jobPositions: {
            type: String,
        },
        jobLocation: {
            type: String,
        },
        workType: {
            type: String,
            enum: ["Office", "Remote", "Hybrid"],
        },
        experience: {
            type: String,
            enum: ["0 Years", "1 Year", "2 Years", "3+ Years"],
        },
        salary: {
            type: String,
        },
        jobDescription: {
            type: String,
        },
    },

    documents: {
        recruiterID: {
            type: String,
        },
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("RecruiterProfile", recruiterProfileSchema);
