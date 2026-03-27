const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const { requireAuth } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/upload
 * @desc    Upload a single file to Cloudinary
 * @access  Admin
 */
router.post('/', requireAuth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the full secure Cloudinary URL (prioritize secure_url or url over path)
        const finalUrl = req.file.secure_url || req.file.url || req.file.path;

        res.json({
            url: finalUrl,
            filename: req.file.filename,
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: 'Failed to process file upload' });
    }
});

module.exports = router;
