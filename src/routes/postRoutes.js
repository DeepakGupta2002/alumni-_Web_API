const express = require('express');
const { verifyToken, checkRole } = require('../midilehere/authMiddleware');
const {
    createCommonPost,
    getUserPosts,
    getAllPosts,
    updatePost,
    deletePost,
    getAllPublicPosts
} = require('../controllers/postController');
const { uploadCloud } = require('../midilehere/cloudinaryUpload');
const {
    likePost,
    unlikePost,
    addComment,
    deleteComment
} = require('../controllers/postController');
const postRouter = express.Router();

// Create Post
postRouter.post(
    '/create',
    verifyToken,
    checkRole(['alumni', 'recruiter', 'university_admin']),
    uploadCloud.array('images', 5),
    createCommonPost
);

// Get All Posts (Admin/Viewer)
postRouter.get('/', getAllPosts);

// Get Posts by current university_admin
postRouter.get('/mine', verifyToken, checkRole(['alumni', 'recruiter', 'university_admin']), getUserPosts);

// Update Post
postRouter.put('/:id', verifyToken, checkRole(['alumni', 'recruiter', 'university_admin']), uploadCloud.array('images', 5), updatePost);

// Delete Post
postRouter.delete('/:id', verifyToken, checkRole(['alumni', 'recruiter', 'university_admin']), deletePost);




// Like / Unlike
postRouter.post('/:id/like', verifyToken, likePost);
postRouter.post('/:id/unlike', verifyToken, unlikePost);

// Comment / Delete Comment
postRouter.post('/:id/comment', verifyToken, addComment);
postRouter.delete('/:id/comment/:commentId', verifyToken, deleteComment);
postRouter.get("/public-posts", getAllPublicPosts);

module.exports = { postRouter };
