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
    params: async (req, file) => {
        const folderName = req.query.folder || 'portfolio';
        const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
        
        return {
            folder: `portfolio/${folderName}`,
            public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/\s+/g, '_').toLowerCase()}`,
            resource_type: isPdf ? 'raw' : 'auto',
        };
    },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
