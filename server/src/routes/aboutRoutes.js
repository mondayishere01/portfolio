const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAbout);
router.put('/', requireAuth, requireAdmin, updateAbout);

module.exports = router;
