const { Institute } = require("../models/Institute/Institute")

// const Institute = require("../models/Institute/Institute"); // ✅ default import

// Register Institute
const registerInstitute = async (req, res) => {
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
            userId: req.user._id, // <-- user id aa gaya verifyToken se
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
};


// ✅ Get Institute for Logged In User
const getAllInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find({ userId: req.user._id }); // only own
        res.status(200).json({ success: true, data: institutes });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch institutes", error: err.message });
    }
};

// ✅ Get Institute by ID (only if it belongs to user)
const getInstituteById = async (req, res) => {
    try {
        const institute = await Institute.findOne({ _id: req.params.id, userId: req.user._id });
        if (!institute) return res.status(404).json({ success: false, message: "Institute not found" });
        res.status(200).json({ success: true, data: institute });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch institute", error: err.message });
    }
};

// ✅ Update Institute (only if owned by user)
const updateInstitute = async (req, res) => {
    console.log(req.body);
    try {
        const updated = await Institute.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Institute not found or unauthorized" });
        res.status(200).json({ success: true, message: "Institute updated", data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update institute", error: err.message });
    }
};

// ✅ Delete Institute (only if owned by user)
const deleteInstitute = async (req, res) => {
    try {
        const deleted = await Institute.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) return res.status(404).json({ success: false, message: "Institute not found or unauthorized" });
        res.status(200).json({ success: true, message: "Institute deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete institute", error: err.message });
    }
};



exports.verifyInstitute =
    module.exports = {
        registerInstitute,
        getAllInstitutes,
        getInstituteById,
        updateInstitute,
        deleteInstitute,
        // verifyInstitute,
    };
