const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const requireAuth = require('../middleware/authMiddleware');

router.get('/', getAbout);
router.put('/', requireAuth, updateAbout);

module.exports = router;
