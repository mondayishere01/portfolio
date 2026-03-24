const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @route   GET /api/users
 * @desc    Get all users (authors and admins)
 * @access  Admin
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * @route   POST /api/users
 * @desc    Create a new user (author)
 * @access  Admin
 */
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: email.trim(),
            passwordHash,
            role: role || 'author'
        });

        res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Admin
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent deleting oneself
        if (id === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

/**
 * @route   PUT /api/users/me
 * @desc    Update requesting user's profile (name, bio, image, socials)
 * @access  Private (Self)
 */
const updateProfile = async (req, res) => {
    try {
        const { name, email, bio, imageUrl, socialLinks, password } = req.body;
        const updates = {};
        
        if (name) updates.name = name;
        if (email) updates.email = email.trim();
        if (bio !== undefined) updates.bio = bio;
        if (imageUrl !== undefined) updates.imageUrl = imageUrl;
        if (socialLinks) updates.socialLinks = socialLinks;
        
        if (password) {
            updates.passwordHash = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

module.exports = { getAllUsers, createUser, deleteUser, updateProfile };
