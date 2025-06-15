const express = require("express");
const path = require("path");
const multer = require("multer");
const Institute = require("../../models/Institute/Institute");
const { verifyToken, checkRole } = require("../../midilehere/authMiddleware");
const { getAllInstitutes, getInstituteById, updateInstitute, deleteInstitute, verifyInstitute } = require("../../controllers/instituteController");
const { uploadCloud } = require("../../midilehere/cloudinaryUpload"); // ✅ Cloudinary Multer

const InstituteRouter = express.Router();

/* ----------- Register Institute Route with Cloudinary ------------ */
InstituteRouter.post(
    "/institute/register",
    verifyToken,
    checkRole(["university_admin"]),
    uploadCloud.fields([
        { name: "logo", maxCount: 1 },
        { name: "authorizationLetter", maxCount: 1 },
        { name: "idProof", maxCount: 1 },
        { name: "ugcCertificate", maxCount: 1 },
        { name: "aicteApproval", maxCount: 1 },
        { name: "naacAccreditation", maxCount: 1 },
        { name: "bciLicense", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const existingInstitute = await Institute.findOne({ userId: req.user._id });
            if (existingInstitute) {
                return res.status(400).json({
                    success: false,
                    message: "You have already registered an institute.",
                });
            }

            const {
                instituteName,
                instituteType,
                email,
                phone,
                website,
                establishedYear,
                address,
                affiliations,
                contactPerson,
            } = req.body;

            const files = req.files || {};

            const newInstitute = new Institute({
                userId: req.user._id,
                instituteName,
                instituteType,
                email,
                phone,
                website,
                establishedYear,
                address,
                affiliations,
                logo: files.logo?.[0]?.path || null,
                authorizationLetter: files.authorizationLetter?.[0]?.path || null,
                idProof: files.idProof?.[0]?.path || null,
                ugcCertificate: files.ugcCertificate?.[0]?.path || null,
                aicteApproval: files.aicteApproval?.[0]?.path || null,
                naacAccreditation: files.naacAccreditation?.[0]?.path || null,
                bciLicense: files.bciLicense?.[0]?.path || null,
                contactPerson,
            });

            await newInstitute.save();

            return res.status(201).json({
                success: true,
                message: "Institute registered successfully!",
                data: newInstitute,
            });
        } catch (error) {
            console.error("Registration Error:", error);
            return res.status(500).json({
                success: false,
                message: "Registration failed!",
                error: error.message,
            });
        }
    }
);

// ✅ Read All Institutes
InstituteRouter.get("/institute/all", verifyToken, checkRole(["university_admin"]), async (req, res) => {
    try {
        const institutes = await Institute.find({ userId: req.user._id });
        res.status(200).json({ success: true, data: institutes });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch institutes", error: err.message });
    }
});

// ✅ Read One
InstituteRouter.get("/institute/:id", verifyToken, checkRole(["university_admin"]), getInstituteById);

// ✅ Update Institute with Cloudinary
InstituteRouter.put(
    "/institute/:id",
    verifyToken,
    checkRole(["university_admin"]),
    uploadCloud.any(), // ✅ use Cloudinary middleware
    async (req, res) => {
        console.log("Update Body:", req.body);
        console.log("Update Files:", req.files);

        try {
            // optional: update image paths if needed
            const updateData = {
                ...req.body,
            };

            // overwrite paths if files are re-uploaded
            req.files?.forEach((file) => {
                updateData[file.fieldname] = file.path;
            });

            const updated = await Institute.findOneAndUpdate(
                { userId: req.user._id },
                { $set: updateData },
                { new: true }
            );

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: "Institute not found or unauthorized",
                });
            }

            res.status(200).json({
                success: true,
                message: "Institute updated",
                data: updated,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to update institute",
                error: err.message,
            });
        }
    }
);


InstituteRouter.put(
    "/verify-institute/:id",
    verifyToken,
    checkRole("SuparAdmin"),
    async (req, res) => {
        try {
            const instituteId = req.params.id;

            // Optional: Aap kisi aur status bhi bhej sakte ho body me
            const statusToUpdate = req.body.status || "Verified";

            const updatedInstitute = await Institute.findByIdAndUpdate(
                instituteId,
                { status: statusToUpdate },
                { new: true }
            );

            if (!updatedInstitute) {
                return res.status(404).json({ message: "Institute not found" });
            }

            res.status(200).json({
                message: "Institute verification status updated successfully",
                institute: updatedInstitute,
            });
        } catch (error) {
            res.status(500).json({ message: "Error updating status", error: error.message });
        }
    });

InstituteRouter.get("/all-institutes", async (req, res) => {
    try {
        const institutes = await Institute.find();

        res.status(200).json({
            message: "All institutes fetched successfully",
            total: institutes.length,
            institutes: institutes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching institutes",
            error: error.message,
        });
    }
});

// ✅ Delete
InstituteRouter.get("/verified-institutes", async (req, res) => {
    try {
        const verifiedInstitutes = await Institute.find({ status: "Verified" }).select("instituteName _id");

        res.status(200).json({
            success: true,
            message: "Verified institutes fetched successfully",
            data: verifiedInstitutes,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching verified institutes",
            error: error.message,
        });
    }
});

InstituteRouter.delete("/institute/:id", verifyToken, checkRole(["university_admin"]), deleteInstitute);

module.exports = { InstituteRouter };
