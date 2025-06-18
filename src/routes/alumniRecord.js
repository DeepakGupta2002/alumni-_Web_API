const express = require("express");
const AlumaiRecordRouter = express.Router();
const { verifyToken } = require("../midilehere/authMiddleware");
const {
    createAlumniRecord,
    getAlumniRecordsByInstitute,
    updateAlumniRecord,
    deleteAlumniRecord,
    verifyEnrollment,
    getProfilesByInstitute,
    verifyProfilesByInstitute,
    getAllVerifiedAlumni
} = require("../controllers/alumniRecordController");

// ✅ Always put static routes BEFORE dynamic ones
AlumaiRecordRouter.get('/verified-alumni', getAllVerifiedAlumni);

// POST: Add new record
AlumaiRecordRouter.post("/", verifyToken, createAlumniRecord);

// GET: Records by institute
AlumaiRecordRouter.get("/:instituteId", verifyToken, getAlumniRecordsByInstitute);

// PUT: Update record
AlumaiRecordRouter.put("/:id", verifyToken, updateAlumniRecord);

// DELETE: Remove record
AlumaiRecordRouter.delete("/:id", verifyToken, deleteAlumniRecord);

// GET: Get profiles by institute
AlumaiRecordRouter.get("/institute/:instituteId", verifyToken, getProfilesByInstitute);

// PUT: Verify profiles by institute
AlumaiRecordRouter.put('/verify-profiles/:instituteId', verifyProfilesByInstitute);

module.exports = { AlumaiRecordRouter };
