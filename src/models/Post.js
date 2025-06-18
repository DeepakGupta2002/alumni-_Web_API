const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        default: '' // Make it optional with empty string as default
    },
    content: { type: String, required: true },
    images: [{ type: String }], // multiple image support
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByRole: { type: String, enum: ['alumni', 'recruiter', 'university_admin'], required: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
