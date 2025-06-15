const express = require("express");
const RecruiterRouter = express.Router();
const {
    createRecruiterProfile,
    getAllRecruiters,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
} = require("../../controllers/recruiterProfileController");

const { verifyToken, checkRole } = require("../../midilehere/authMiddleware");
const { uploadCloud } = require("../../midilehere/cloudinaryUpload"); // ✅ Cloudinary multer

// Upload fields using Cloudinary
const uploadFields = uploadCloud.fields([
    { name: "logo", maxCount: 1 },
    { name: "recruiterID", maxCount: 1 },
]);

// Routes
RecruiterRouter.post("/profile", verifyToken, checkRole(["recruiter"]), uploadFields, createRecruiterProfile);         // Create profile
RecruiterRouter.get("/profiles", getAllRecruiters);                                                                     // Get all recruiters
RecruiterRouter.get("/profile/me", verifyToken, checkRole(["recruiter"]), getMyProfile);                                // Get my profile
RecruiterRouter.put("/profile/me", verifyToken, checkRole(["recruiter"]), uploadFields, updateMyProfile);              // Update my profile
RecruiterRouter.delete("/profile/me", verifyToken, checkRole(["recruiter"]), deleteMyProfile);                         // Delete my profile

module.exports = { RecruiterRouter };
