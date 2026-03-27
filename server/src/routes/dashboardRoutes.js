const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/stats', requireAuth, requireAdmin, getDashboardStats);

module.exports = router;
