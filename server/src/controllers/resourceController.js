const { cloudinary } = require('../utils/cloudinary');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const About = require('../models/About');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Certification = require('../models/Certification');

/**
 * @route   GET /api/resources
 * @desc    Get all Cloudinary resources in the 'portfolio' folder with 'in-use' status
 * @access  Admin
 */
const getResources = async (req, res) => {
    try {
        // 1. Fetch resources from Cloudinary (both image and raw)
        // Note: Admin API .resources() needs to be called per resource_type if not using Search API
        const [imageRes, rawRes] = await Promise.all([
            cloudinary.api.resources({
                type: 'upload',
                resource_type: 'image',
                prefix: 'portfolio/',
                max_results: 500,
            }),
            cloudinary.api.resources({
                type: 'upload',
                resource_type: 'raw',
                prefix: 'portfolio/',
                max_results: 500,
            })
        ]);

        const assets = [...imageRes.resources, ...rawRes.resources];

        // 2. Fetch all "In Use" URLs from DB
        const [projects, experiences, about, blogs, users, skills, certifications] = await Promise.all([
            Project.find({}, 'imageUrl'),
            Experience.find({}, 'imageUrl'),
            About.findOne({}, 'resumeUrl'),
            Blog.find({}, 'imageUrl'),
            User.find({}, 'imageUrl'),
            Skill.find({}, 'imageUrl'),
            Certification.find({}, 'imageUrl'),
        ]);

        // Helper to extract Public ID from Cloudinary URL
        const extractPublicId = (url) => {
            if (!url || typeof url !== 'string') return null;
            // Handle both /image/upload/ and /raw/upload/
            const parts = url.split(/\/upload\//);
            if (parts.length < 2) return null;
            
            // Remove version and file extension, and decode URI components (e.g. %20 -> space)
            let pathInfo = parts[1].replace(/^v\d+\//, '');
            
            // If it's a raw file, it might not have an extension that we want to strip if the public_id includes it
            // but usually we strip the extension for images. For raw, public_id INCLUDES the extension.
            const isRaw = url.includes('/raw/upload/');
            
            if (!isRaw) {
                pathInfo = pathInfo.split('.')[0];
            }
            
            return decodeURIComponent(pathInfo);
        };

        // Flatten all Public IDs into a Set for O(1) lookup
        const usedPublicIds = new Set();
        const addUrlToUsed = (url) => {
            const pid = extractPublicId(url);
            if (pid) usedPublicIds.add(pid);
        };

        projects.forEach(p => addUrlToUsed(p.imageUrl));
        experiences.forEach(e => addUrlToUsed(e.imageUrl));
        if (about?.resumeUrl) addUrlToUsed(about.resumeUrl);
        blogs.forEach(b => addUrlToUsed(b.imageUrl));
        users.forEach(u => addUrlToUsed(u.imageUrl));
        skills.forEach(s => addUrlToUsed(s.imageUrl));
        certifications.forEach(c => addUrlToUsed(c.imageUrl));

        // 3. Map status to assets
        const results = assets.map(asset => ({
            public_id: asset.public_id,
            url: asset.secure_url,
            format: asset.format,
            bytes: asset.bytes,
            width: asset.width,
            height: asset.height,
            created_at: asset.created_at,
            inUse: usedPublicIds.has(asset.public_id),
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
