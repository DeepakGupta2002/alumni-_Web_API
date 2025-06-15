// const AlumniProfile = require("..");

const AlumniProfile = require("../models/AlumniProfile");

exports.createProfile = async (req, res) => {
    try {
        const body = req.body;
        body.userId = req.user.id;

        if (req.files?.marksheet?.[0]) body.marksheetUrl = req.files.marksheet[0].path;
        if (req.files?.photo?.[0]) body.photoUrl = req.files.photo[0].path;

        const newProfile = await AlumniProfile.create(body);
        res.status(201).json({ message: "Profile created", data: newProfile });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllProfiles = async (req, res) => {
    try {
        const filter = req.query.userId ? { userId: req.query.userId } : {};
        const profiles = await AlumniProfile.find(filter).populate("userId", "userName email");
        res.json({ count: profiles.length, data: profiles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProfileById = async (req, res) => {
    try {
        const profile = await AlumniProfile.findById(req.params.id).populate("userId", "userName email");
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        if (req.files?.marksheet?.[0]) req.body.marksheetUrl = req.files.marksheet[0].path;
        if (req.files?.photo?.[0]) req.body.photoUrl = req.files.photo[0].path;

        const updated = await AlumniProfile.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({ message: "Profile updated", data: updated });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await AlumniProfile.findByIdAndDelete(req.params.id);
        res.json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
