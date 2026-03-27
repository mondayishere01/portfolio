const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary, upload } = require('../utils/cloudinary');
const { requireAuth } = require('../middleware/authMiddleware');
const streamifier = require('streamifier');

// In-memory multer for raw file uploads (PDFs)
const memoryUpload = multer({ storage: multer.memoryStorage() });

/**
 * @route   POST /api/upload
 * @desc    Upload a single file to Cloudinary
 * @access  Admin
 */
router.post('/', requireAuth, (req, res, next) => {
    // Check the folder query param — if it's "Resume", use raw upload for PDFs
    const folder = req.query.folder || 'portfolio';

    if (folder === 'Resume') {
        // Use memory upload + direct Cloudinary SDK for raw files (PDFs)
        memoryUpload.single('file')(req, res, async (err) => {
            if (err) return res.status(500).json({ error: 'Upload failed' });
            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

            try {
                const ext = req.file.originalname.split('.').pop().toLowerCase();
                const originalName = req.file.originalname.split('.')[0].replace(/\s+/g, '_').toLowerCase();
                const publicId = `Portfolio Assets/Resume/${Date.now()}-${originalName}.${ext}`;

                // Upload buffer to Cloudinary as raw (works for PDFs)
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'raw',
                            public_id: publicId,
                            access_mode: 'public',
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });

                res.json({
                    url: result.secure_url,
                    filename: result.public_id,
                });
            } catch (uploadErr) {
                console.error('Raw Upload Error:', uploadErr);
                res.status(500).json({ error: 'Failed to upload PDF' });
            }
        });
    } else {
        // Use normal multer-storage-cloudinary for images
        upload.single('file')(req, res, (err) => {
            if (err) return res.status(500).json({ error: 'Upload failed' });
            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

            const finalUrl = req.file.secure_url || req.file.url || req.file.path;
            res.json({
                url: finalUrl,
                filename: req.file.filename,
            });
        });
    }
});

module.exports = router;
