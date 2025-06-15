// midilehere/cloudinaryUpload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../../config/cloudinary');
// const cloudinary = require('../config/cloudinary'); // cloudinary.config({...})
// cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'institutes',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        resource_type: 'auto',
    },
});

const uploadCloud = multer({ storage });
module.exports = { uploadCloud };
