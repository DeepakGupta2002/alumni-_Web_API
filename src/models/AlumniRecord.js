const mongoose = require("mongoose");

const AlumniRecordSchema = new mongoose.Schema(
    {
        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        fullName: { type: String, required: true },
        enrollment: { type: String, required: true },
        courseName: { type: String, required: true },
        passingYear: { type: Number },
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Compound index: prevent duplicate enrollment in same institute
AlumniRecordSchema.index({ enrollment: 1, instituteId: 1 }, { unique: true });

module.exports = mongoose.model("AlumniRecord", AlumniRecordSchema);
