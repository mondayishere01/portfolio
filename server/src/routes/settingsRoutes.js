const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getSettings);  // Public — blog title/subtitle are needed by public pages
router.put('/', requireAuth, requireAdmin, updateSettings);

module.exports = router;
