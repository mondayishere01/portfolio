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
            return `Portfolio Assets/${folder}`;
        },
        public_id: (req, file) => {
            const originalName = file.originalname.split('.')[0].replace(/\s+/g, '_').toLowerCase();
            return `${Date.now()}-${originalName}`;
        },
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg', 'pdf'],
        resource_type: 'auto',
        type: 'upload',
        access_mode: 'public',
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
