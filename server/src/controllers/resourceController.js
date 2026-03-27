const { cloudinary } = require('../utils/cloudinary');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const About = require('../models/About');
const Blog = require('../models/Blog');
const User = require('../models/User');

/**
 * @route   GET /api/resources
 * @desc    Get all Cloudinary resources in the 'portfolio' folder with 'in-use' status
 * @access  Admin
 */
const getResources = async (req, res) => {
    try {
        // 1. Fetch resources from Cloudinary
        // Note: Using the Admin API .resources() method
        const cloudRes = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'portfolio/', // only files in this folder
            max_results: 500,
        });

        const assets = cloudRes.resources;

        // 2. Fetch all "In Use" URLs from DB
        const [projects, experiences, about, blogs, users] = await Promise.all([
            Project.find({}, 'imageUrl'),
            Experience.find({}, 'imageUrl'),
            About.findOne({}, 'resumeUrl'),
            Blog.find({}, 'imageUrl'),
            User.find({}, 'imageUrl'),
        ]);

        // Flatten all URLs into a Set for O(1) lookup
        const usedUrls = new Set();
        projects.forEach(p => p.imageUrl && usedUrls.add(p.imageUrl));
        experiences.forEach(e => e.imageUrl && usedUrls.add(e.imageUrl));
        if (about?.resumeUrl) usedUrls.add(about.resumeUrl);
        blogs.forEach(b => b.imageUrl && usedUrls.add(b.imageUrl));
        users.forEach(u => u.imageUrl && usedUrls.add(u.imageUrl));

        // 3. Map status to assets
        const results = assets.map(asset => ({
            public_id: asset.public_id,
            url: asset.secure_url,
            format: asset.format,
            bytes: asset.bytes,
            width: asset.width,
            height: asset.height,
            created_at: asset.created_at,
            inUse: usedUrls.has(asset.secure_url),
        }));

        res.json(results);
    } catch (err) {
        console.error('Resource Error:', err);
        res.status(500).json({ 
            error: 'Failed to fetch Cloudinary resources',
            details: err.message || 'Unknown Cloudinary error'
        });
    }
};

/**
 * @route   DELETE /api/resources/*
 * @desc    Delete a resource from Cloudinary by public_id
 * @access  Admin
 */
const deleteResource = async (req, res) => {
    try {
        const public_id = req.query.public_id || req.params.id;
        
        if (!public_id) {
            return res.status(400).json({ error: 'Public ID is required' });
        }

        const result = await cloudinary.uploader.destroy(public_id);
        
        if (result.result === 'not found') {
            return res.status(404).json({ error: 'Resource not found on Cloudinary' });
        }

        res.json({ message: 'Resource deleted successfully', result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete resource' });
    }
};

module.exports = { getResources, deleteResource };
