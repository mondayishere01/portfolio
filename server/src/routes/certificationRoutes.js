const express = require('express');
const router = express.Router();
const { getAllCertifications, createCertification, updateCertification, deleteCertification } = require('../controllers/certificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllCertifications);
router.post('/', authMiddleware, createCertification);
router.put('/:id', authMiddleware, updateCertification);
router.delete('/:id', authMiddleware, deleteCertification);

module.exports = router;
