const Blog = require('../models/Blog');
const ContactMessage = require('../models/ContactMessage');
const Project = require('../models/Project');
const Experience = require('../models/Experience');

const getDashboardStats = async (req, res) => {
    try {
        const blogCount = await Blog.countDocuments();
        const unreadMessages = await ContactMessage.countDocuments({ status: 'unread' });
        // Some systems might not have a 'status' field yet, let's check the model or just count all for now if unsure
        // But usually "5 New" implies unread.
        
        const projectCount = await Project.countDocuments();
        const experienceCount = await Experience.countDocuments();

        res.json({
            blogs: blogCount,
            messages: unreadMessages,
            projects: projectCount,
            experiences: experienceCount
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

module.exports = { getDashboardStats };
