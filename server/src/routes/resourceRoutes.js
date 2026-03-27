const express = require('express');
const router = express.Router();
const { getResources, deleteResource } = require('../controllers/resourceController');
const { requireAuth } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/resources
 * @desc    Get all Cloudinary resources in the 'portfolio' folder with 'in-use' status
 * @access  Admin
 */
router.get('/', requireAuth, getResources);

/**
 * @route   DELETE /api/resources/*
 * @desc    Delete a resource from Cloudinary by public_id
 * @access  Admin
 */
router.delete('/delete', requireAuth, deleteResource);

module.exports = router;
