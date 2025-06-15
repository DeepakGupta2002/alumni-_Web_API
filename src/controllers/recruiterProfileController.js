const RecruiterProfile = require("../models/recuriter/Recruiter");

// CREATE
exports.createRecruiterProfile = async (req, res) => {
    try {
        const {
            recruiterName = null,
            contact = null,
            email = null,
            companyName = null,
            website = null,
            address = null,
            jobPositions = null,
            jobLocation = null,
            workType = null,
            experience = null,
            salary = null,
            jobDescription = null,
        } = req.body;

        const logo = req.files?.logo?.[0]?.path || null;
        const recruiterID = req.files?.recruiterID?.[0]?.path || null;

        const profile = new RecruiterProfile({
            user: req.user.id,
            recruiterName,
            contact,
            email,
            company: {
                name: companyName,
                website,
                address,
                logo,
            },
            jobDetails: {
                jobPositions,
                jobLocation,
                workType,
                experience,
                salary,
                jobDescription,
            },
            documents: {
                recruiterID,
            },
        });

        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Create failed", error: error.message });
    }
};

// UPDATE
exports.updateMyProfile = async (req, res) => {
    try {
        const {
            recruiterName = null,
            contact = null,
            email = null,
            companyName = null,
            website = null,
            address = null,
            jobPositions = null,
            jobLocation = null,
            workType = null,
            experience = null,
            salary = null,
            jobDescription = null,
        } = req.body;

        const logo = req.files?.logo?.[0]?.path || null;
        const recruiterID = req.files?.recruiterID?.[0]?.path || null;

        const updatedProfile = await RecruiterProfile.findOneAndUpdate(
            { user: req.user.id },
            {
                recruiterName,
                contact,
                email,
                company: {
                    name: companyName,
                    website,
                    address,
                    logo,
                },
                jobDetails: {
                    jobPositions,
                    jobLocation,
                    workType,
                    experience,
                    salary,
                    jobDescription,
                },
                documents: {
                    recruiterID,
                },
            },
            { new: true }
        );

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};


// DELETE
exports.deleteMyProfile = async (req, res) => {
    try {
        const deleted = await RecruiterProfile.findOneAndDelete({ user: req.user.id });
        if (!deleted) return res.status(404).json({ message: "Profile not found" });

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};
exports.getMyProfile = async (req, res) => {
    try {
        const profile = await RecruiterProfile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed", error: error.message });
    }
};
exports.getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await RecruiterProfile.find().populate("user", "name email");
        res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ message: "Fetch failed", error: error.message });
    }
};
