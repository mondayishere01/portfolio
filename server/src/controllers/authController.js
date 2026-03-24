const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_EXPIRY = '24h';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin and return a JWT token
 * @access  Public
 */
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
        });

        res.json({ token, admin: { id: admin._id, email: admin.email } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { loginAdmin };
