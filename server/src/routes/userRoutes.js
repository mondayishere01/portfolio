const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, deleteUser, updateProfile, getProfile } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Routes accessible by the logged-in user themselves
router.get('/me', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);

// Admin-only routes for managing authors
router.get('/', requireAuth, requireAdmin, getAllUsers);
router.post('/', requireAuth, requireAdmin, createUser);
router.delete('/:id', requireAuth, requireAdmin, deleteUser);

module.exports = router;
