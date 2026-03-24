const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_EXPIRY = '24h';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return a JWT token with user role
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: JWT_EXPIRY }
        );

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl 
            } 
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { loginUser };
