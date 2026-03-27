const Blog = require('../models/Blog');
const Newsletter = require('../models/Newsletter');
const { sendBlogBroadcast } = require('../utils/emailService');

/**
 * @route   GET /api/blogs
 * @desc    Get all blogs, support filtering by category or tag
 * @access  Public
 */
const getAllBlogs = async (req, res) => {
    try {
        const { category, tag } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (tag) {
            query.tags = { $in: [tag] }; // Matches any array containing the tag
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name imageUrl bio')
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
};

/**
 * @route   GET /api/blogs/:id
 * @desc    Get a single blog by ID
 * @access  Public
 */
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name imageUrl bio socialLinks');

        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        // Find neighbors for recommendation box
        const prev = await Blog.findOne({ createdAt: { $lt: blog.createdAt } })
            .sort({ createdAt: -1 })
            .select('title _id');

        const next = await Blog.findOne({ createdAt: { $gt: blog.createdAt } })
            .sort({ createdAt: 1 })
            .select('title _id');

        res.json({
            ...blog.toObject(),
            prev,
            next
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
};

/**
 * @route   POST /api/blogs
 * @desc    Create a new blog
 * @access  Private (Author/Admin)
 */
const createBlog = async (req, res) => {
    try {
        const { title, content, imageUrl, category, tags } = req.body;

        const blog = await Blog.create({
            title,
            content,
            imageUrl,
            category,
            tags,
            author: req.user.id, // Authenticated user is the author
        });

        // Async broadcast to subscribers
        const subscribers = await Newsletter.find({ active: true }).select('email');
        if (subscribers.length > 0) {
            // Use setImmediate to send emails without blocking the API response
            setImmediate(() => sendBlogBroadcast(blog, subscribers));
        }

        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create blog' });
    }
};

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update a blog
 * @access  Private (Own Author or Admin)
 */
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        // Authorization check: User must be the author OR an admin
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to edit this blog' });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('author', 'name imageUrl bio');

        res.json(updatedBlog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update blog' });
    }
};

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete a blog
 * @access  Private (Own Author or Admin)
 */
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ error: 'Blog not found' });

        // Authorization check: User must be the author OR an admin
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this blog' });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
