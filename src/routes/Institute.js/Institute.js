const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Institute = require("../../models/Institute/Institute");
// const Institute = require(".");

const InstituteRouter = express.Router();
// MongoDB Connection

// Middleware

// app.use("/uploads", express.static("uploads"));

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// API: Register Institute
InstituteRouter.post("/institute/register", upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "authorizationLetter", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "ugcCertificate", maxCount: 1 },
    { name: "aicteApproval", maxCount: 1 },
    { name: "naacAccreditation", maxCount: 1 },
    { name: "bciLicense", maxCount: 1 },
]), async (req, res) => {
    console.log(req.body)
    try {
        const { instituteName, instituteType, email, phone, website, establishedYear, address, affiliations, contactPerson } = req.body;
        const files = req.files;

        const newInstitute = new Institute({
            instituteName,
            instituteType,
            email,
            phone,
            website,
            establishedYear,
            address,
            affiliations,
            logo: files.logo ? files.logo[0].path : null,
            authorizationLetter: files.authorizationLetter ? files.authorizationLetter[0].path : null,
            idProof: files.idProof ? files.idProof[0].path : null,
            ugcCertificate: files.ugcCertificate ? files.ugcCertificate[0].path : null,
            aicteApproval: files.aicteApproval ? files.aicteApproval[0].path : null,
            naacAccreditation: files.naacAccreditation ? files.naacAccreditation[0].path : null,
            bciLicense: files.bciLicense ? files.bciLicense[0].path : null,
            contactPerson,
        });

        await newInstitute.save();

        res.status(201).json({
            success: true,
            message: "Institute registered successfully!",
            data: newInstitute,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed!",
            error: error.message,
        });
    }
});
module.exports = { InstituteRouter }