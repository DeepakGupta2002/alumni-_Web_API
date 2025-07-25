
// const AlumniRecord = require("../models/AlumniRecord");

const AlumniProfile = require("../models/AlumniProfile");
const AlumniRecord = require("../models/AlumniRecord");

// Add a new alumni record
exports.createAlumniRecord = async (req, res) => {
    try {
        const { fullName, enrollment, courseName, passingYear, instituteId } = req.body;

        const existing = await AlumniRecord.findOne({ enrollment, instituteId });
        if (existing) {
            return res.status(400).json({ message: "Alumni record already exists for this enrollment." });
        }

        const newRecord = new AlumniRecord({
            fullName,
            enrollment,
            courseName,
            passingYear,
            instituteId,
        });

        await newRecord.save();

        // ✅ Auto-verify matching AlumniProfile if it exists
        const verifiedProfile = await AlumniProfile.findOneAndUpdate(
            {
                enrollment: enrollment.trim(),
                college: new mongoose.Types.ObjectId(instituteId)
            },
            { verified: true },
            { new: true }
        );

        let response = {
            message: "Alumni record added successfully",
            record: newRecord
        };

        if (verifiedProfile) {
            response.verifiedProfile = verifiedProfile;
            response.verificationMessage = "Matching alumni profile verified automatically.";
        }

        res.status(201).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// Get all alumni records for an institute
exports.getAlumniRecordsByInstitute = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const records = await AlumniRecord.find({ instituteId });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: "Error fetching records", error: err.message });
    }
};

// Update alumni record by ID
exports.updateAlumniRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await AlumniRecord.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ message: "Alumni record updated", record: updated });
    } catch (err) {
        res.status(500).json({ message: "Error updating record", error: err.message });
    }
};

// Delete alumni record by ID
exports.deleteAlumniRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await AlumniRecord.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ message: "Alumni record deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting record", error: err.message });
    }
};

// Verify enrollment by enrollment + instituteId
exports.verifyEnrollment = async (req, res) => {
    try {
        const { enrollment, instituteId } = req.query;

        const record = await AlumniRecord.findOne({ enrollment, instituteId });
        if (record) {
            res.status(200).json({
                verified: true,
                record,
                message: "Alumni verified with institute record",
            });
        } else {
            res.status(404).json({
                verified: false,
                message: "No matching alumni record found",
            });
        }
    } catch (err) {
        res.status(500).json({ message: "Error verifying enrollment", error: err.message });
    }
};

// GET all AlumniProfiles with matching instituteId
exports.getProfilesByInstitute = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const profiles = await AlumniProfile.find({ college: instituteId });
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profiles", error: err.message });
    }
};
const mongoose = require("mongoose");


exports.verifyProfilesByInstitute = async (req, res) => {
    try {
        const { instituteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(instituteId)) {
            return res.status(400).json({ message: "Invalid instituteId" });
        }

        const alumniRecords = await AlumniRecord.find({ instituteId });

        let verifiedCount = 0;
        let verifiedProfiles = [];

        for (const record of alumniRecords) {
            const enrollment = record.enrollment?.trim();
            if (!enrollment) continue;

            const result = await AlumniProfile.findOneAndUpdate(
                {
                    enrollment: enrollment,
                    college: new mongoose.Types.ObjectId(instituteId)
                },
                { verified: true },
                { new: true }
            );

            if (result) {
                verifiedCount++;
                verifiedProfiles.push(result);

                // ✅ Also update corresponding AlumniRecord's verified field
                await AlumniRecord.findOneAndUpdate(
                    {
                        enrollment: enrollment,
                        instituteId: new mongoose.Types.ObjectId(instituteId)
                    },
                    { verified: true }
                );
            }
        }

        res.status(200).json({
            message: `${verifiedCount} profile(s) verified successfully.`,
            verifiedProfiles: verifiedProfiles
        });

    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ message: "Verification process failed", error: err.message });
    }
};
exports.getAllVerifiedAlumni = async (req, res) => {
    try {
        const verifiedAlumni = await AlumniProfile.find({ verified: true })
            .populate("userId", "name email"); // ← sirf name & email chahiye to

        res.status(200).json(verifiedAlumni);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch verified alumni",
            error: err.message
        });
    }
};
