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
        folder: async (req, file) => {
            const folder = req.query.folder || 'portfolio';
            // Prepend 'Portfolio Assets' if not already there, or just use the structure provided
            return `Portfolio Assets/${folder}`;
        },
        public_id: (req, file) => {
            // Use the original filename (without extension) prefixed with a timestamp
            const originalName = file.originalname.split('.')[0].replace(/\s+/g, '_').toLowerCase();
            return `${Date.now()}-${originalName}`;
        },
        // Support common image formats and pdf for resumes
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg', 'pdf'],
        // 'auto' resource type is needed for pdfs (raw files)
        resource_type: 'auto'
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
