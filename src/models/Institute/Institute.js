const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User ka reference
        instituteName: { type: String, required: true },
        instituteType: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        website: { type: String },
        establishedYear: { type: Number },
        address: {
            city: { type: String },
            state: { type: String },
            pinCode: { type: String },
        },
        affiliations: [{ type: String }],
        ugcCertificate: { type: String },
        aicteApproval: { type: String },
        naacAccreditation: { type: String },
        bciLicense: { type: String },
        logo: { type: String },
        authorizationLetter: { type: String },
        idProof: { type: String },
        contactPerson: {
            name: { type: String, required: true },
            designation: { type: String },
            email: { type: String },
            phone: { type: String },
        },
        status: { type: String, default: "Pending" },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Institute", instituteSchema);
