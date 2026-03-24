const jwt = require('jsonwebtoken');

/**
 * Express middleware that verifies a Bearer JWT token.
 * On success, attaches `req.user` (with id and role) for downstream handlers.
 */
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Express middleware that blocks access to any account that is not an 'admin'.
 * MUST be placed AFTER requireAuth.
 */
const requireAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access only' });
    }
    next();
};

module.exports = { requireAuth, requireAdmin };
