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

// ✅ Static routes FIRST
AlumaiRecordRouter.get('/verified-alumni', getAllVerifiedAlumni);
AlumaiRecordRouter.get("/institute/:instituteId", verifyToken, getProfilesByInstitute);
AlumaiRecordRouter.put('/verify-profiles/:instituteId', verifyProfilesByInstitute);


AlumaiRecordRouter.get("/:instituteId", verifyToken, getAlumniRecordsByInstitute);
AlumaiRecordRouter.post("/", verifyToken, createAlumniRecord);
AlumaiRecordRouter.put("/:id", verifyToken, updateAlumniRecord);
AlumaiRecordRouter.delete("/:id", verifyToken, deleteAlumniRecord);

module.exports = { AlumaiRecordRouter };
