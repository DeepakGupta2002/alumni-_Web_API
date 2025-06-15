// const User = require("../models/User");
const RecruiterProfile = require("../models/recuriter/Recruiter");
// const Institute = require("../models/Institute");
// const AlumniProfile = require("../models/AlumniProfile");

const AlumniProfile = require("../models/AlumniProfile");
const Institute = require("../models/Institute/Institute");
const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        console.log(userId)
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let profile = null;
        let imageUrl = "";

        switch (user.role) {
            case "recruiter":
                profile = await RecruiterProfile.findOne({ user: user._id });
                if (profile && profile.company) imageUrl = profile.company.logo || "";
                break;

            case "university_admin":
                profile = await Institute.findOne({ userId: user._id });
                if (profile) imageUrl = profile.logo || "";
                break;

            case "alumni":
                profile = await AlumniProfile.findOne({ userId: user._id });
                console.log(profile);
                if (profile) imageUrl = profile.photoUrl || "";
                break;

            default:
                return res.status(400).json({ message: "Invalid role" });
        }



        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                universityname: user.universityname,
            },
            profile,
            imageUrl, // ✅ Common field across all roles
        });
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getSuperAdminProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // if (user.role !== "superadmin") {
        //     return res.status(403).json({ message: "Access denied: Not a superadmin" });
        // }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Error fetching superadmin profile:", error);
        res.status(500).json({ message: "Server error" });
    }
}