const express = require('express');
const router = express.Router();
const { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public read access
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected author/admin mutation access
router.post('/', requireAuth, createBlog);
router.put('/:id', requireAuth, updateBlog);
router.delete('/:id', requireAuth, deleteBlog);

module.exports = router;
