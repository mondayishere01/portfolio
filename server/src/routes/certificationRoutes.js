const express = require('express');
const router = express.Router();
const { getAllCertifications, createCertification, updateCertification, deleteCertification } = require('../controllers/certificationController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllCertifications);
router.post('/', requireAuth, requireAdmin, createCertification);
router.put('/:id', requireAuth, requireAdmin, updateCertification);
router.delete('/:id', requireAuth, requireAdmin, deleteCertification);

module.exports = router;
