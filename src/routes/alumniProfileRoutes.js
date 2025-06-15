const express = require("express");
const alumniProfileRouter = express.Router();

const {
    createProfile,
    getAllProfiles,
    getProfileById,
    updateProfile,
    deleteProfile
} = require("../controllers/alumniProfileController");

const { verifyToken, checkRole } = require("../midilehere/authMiddleware");
const AlumniProfile = require("../models/AlumniProfile");
const { uploadCloud } = require("../midilehere/cloudinaryUpload"); // ✅ Cloudinary Middleware

/* ---------- Routes ---------- */

// Create profile
alumniProfileRouter.post(
    "/alumni-profiles",
    verifyToken,
    checkRole(["alumni"]),
    uploadCloud.fields([
        { name: "marksheet", maxCount: 1 },
        { name: "photo", maxCount: 1 }
    ]),
    createProfile
);

// Get all profiles
alumniProfileRouter.get("/alumni-profiles", getAllProfiles);

// Get single profile by ID
alumniProfileRouter.get("/alumni-profiles/:id", getProfileById);

// Update profile
alumniProfileRouter.put(
    "/alumni-profiles/:id",
    verifyToken,
    checkRole(["alumni"]),
    uploadCloud.fields([
        { name: "marksheet", maxCount: 1 },
        { name: "photo", maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const userIdFromToken = req.user.id;
            const profileId = req.params.id;

            const profile = await AlumniProfile.findById(profileId);
            if (!profile) return res.status(404).json({ message: "Profile not found" });
            if (profile.userId.toString() !== userIdFromToken)
                return res.status(403).json({ message: "Unauthorized to update this profile" });

            // Cloudinary URLs
            if (req.files?.marksheet?.[0]) req.body.marksheetUrl = req.files.marksheet[0].path;
            if (req.files?.photo?.[0]) req.body.photoUrl = req.files.photo[0].path;

            // Duplicate enrollment check
            if (req.body.enrollment) {
                const existing = await AlumniProfile.findOne({
                    enrollment: req.body.enrollment,
                    _id: { $ne: profileId }
                });
                if (existing) {
                    return res.status(400).json({ message: "Enrollment number already exists" });
                }
            }

            const updated = await AlumniProfile.findByIdAndUpdate(
                profileId,
                req.body,
                { new: true }
            );

            res.json({ message: "Profile updated successfully", data: updated });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Update failed", error: error.message });
        }
    }
);

// Delete profile
alumniProfileRouter.delete(
    "/alumni-profiles/:id",
    verifyToken,
    checkRole(["alumni"]),
    deleteProfile
);

module.exports = { alumniProfileRouter };
