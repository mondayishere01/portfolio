const express = require('express');
const router = express.Router();
const {
    getAllExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} = require('../controllers/experienceController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllExperiences);
router.post('/', requireAuth, requireAdmin, createExperience);
router.put('/:id', requireAuth, requireAdmin, updateExperience);
router.delete('/:id', requireAuth, requireAdmin, deleteExperience);

module.exports = router;
