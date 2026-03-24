const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   POST /api/upload
 * @desc    Upload a single file to Cloudinary
 * @access  Admin
 */
router.post('/', authMiddleware, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the secure Cloudinary URL
        res.json({
            url: req.file.path,
            filename: req.file.filename,
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: 'Failed to process file upload' });
    }
});

module.exports = router;
