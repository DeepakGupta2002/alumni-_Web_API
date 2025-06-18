const AlumniProfile = require('../models/AlumniProfile');
const Institute = require('../models/Institute/Institute');
const Post = require('../models/Post');

// ✅ Create Post (Already Done)
exports.createCommonPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user._id;       // ✅ From verifyToken
        const role = req.user.role;          // ✅ Role from JWT

        const imageUrls = req.files.map(file => file.path); // ✅ Multiple Cloudinary URLs

        const newPost = new Post({
            title,
            content,
            images: imageUrls,
            author: authorId,
            createdByRole: role              // Optional: store role info
        });

        const savedPost = await newPost.save();

        res.status(201).json({
            message: `Post created successfully by ${role}`,
            post: savedPost
        });

    } catch (error) {
        console.error("Post Creation Error:", error);
        res.status(500).json({ message: "Failed to create post", error: error.message });
    }
};
// ✅ Get All Posts (public or admin)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email') // populate post author
            .populate('comments.user', 'name email') // populate comment author
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get Posts by Logged-in University Admin (user-specific)
exports.getUserPosts = async (req, res) => {
    try {
        const authorId = req.user.id;

        const posts = await Post.find({ author: authorId })
            .populate('author', 'name email _id') // Only get name, email, and id
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update Post (only by owner/admin)
exports.updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Optional: check ownership
        if (post.author.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not allowed to update this post' });

        // If new images uploaded
        let imageUrls = post.images;
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => file.path);
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.images = imageUrls;
        post.updatedAt = new Date();

        const updated = await post.save();
        res.status(200).json({ message: 'Post updated', post: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete Post (only by owner/admin)
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // ✅ Ownership check
        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not allowed to delete this post' });
        }

        // ✅ Safe delete
        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ❤️ Like a Post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const userId = req.user._id;

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "Already liked this post" });
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).json({ message: "Post liked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 💔 Unlike a Post
exports.unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const userId = req.user._id;

        if (!post) return res.status(404).json({ message: "Post not found" });

        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        await post.save();

        res.status(200).json({ message: "Post unliked" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 💬 Add Comment
exports.addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({ user: userId, comment });
        await post.save();

        res.status(201).json({ message: "Comment added", comments: post.comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🗑 Delete Comment
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const userId = req.user._id;
        const commentId = req.params.commentId;

        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = post.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // ✅ Check if current user is comment owner or university admin
        if (comment.user.toString() !== userId.toString() && req.user.role !== 'university_admin') {
            return res.status(403).json({ message: "Not allowed to delete this comment" });
        }

        // 🔥 Proper way to remove comment
        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// controllers/postController.js

// const Post = require("../models/Post");
// const User = require("../models/User");
// const AlumniProfile = require("../models/AlumniProfile");
// const RecruiterProfile = require("../models/RecruiterProfile");
// const Institute = require("../models/Institute");

exports.getAllPublicPosts = async (req, res) => {
    try {
        let posts = await Post.find()
            .populate("author", "name email role") // just name, email, role
            .populate("comments.user", "name role") // comment user basic info
            .sort({ createdAt: -1 })
            .lean(); // lean for modifying objects

        for (let post of posts) {
            // ======= AUTHOR PROFILE IMAGE =========
            const role = post.createdByRole || post.author?.role;
            const userId = post.author?._id;

            if (role === "alumni") {
                const profile = await AlumniProfile.findOne({ userId });
                post.author.image = profile?.photoUrl || null;
            } else if (role === "recruiter") {
                const profile = await RecruiterProfile.findOne({ user: userId });
                post.author.image = profile?.company?.logo || null;
            } else if (role === "university_admin") {
                const profile = await Institute.findOne({ userId });
                post.author.image = profile?.logo || null;
            }

            // ======= COMMENTS USER PROFILE IMAGE =========
            if (post.comments && post.comments.length > 0) {
                for (let comment of post.comments) {
                    const commentUser = comment.user;
                    if (!commentUser) continue;

                    let commentImage = null;

                    if (commentUser.role === "alumni") {
                        const profile = await AlumniProfile.findOne({ userId: commentUser._id });
                        commentImage = profile?.photoUrl || null;
                    } else if (commentUser.role === "recruiter") {
                        const profile = await RecruiterProfile.findOne({ user: commentUser._id });
                        commentImage = profile?.company?.logo || null;
                    } else if (commentUser.role === "university_admin") {
                        const profile = await Institute.findOne({ userId: commentUser._id });
                        commentImage = profile?.logo || null;
                    }

                    comment.user.image = commentImage;
                }
            }
        }

        res.status(200).json({ success: true, posts });

    } catch (error) {
        console.error("Error fetching public posts:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
