const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configure the Cloudinary SDK
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer storage engine to upload directly to a 'portfolio' folder
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio',
        // Support common image formats and pdf for resumes
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg', 'pdf'],
        // 'auto' resource type is needed for pdfs (raw files)
        resource_type: 'auto'
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
