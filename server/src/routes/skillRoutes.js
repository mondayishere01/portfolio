const express = require('express');
const router = express.Router();
const { getAllSkills, createSkill, updateSkill, deleteSkill, getSkillCategories } = require('../controllers/skillController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllSkills);
router.get('/categories', getSkillCategories);
router.post('/', requireAuth, requireAdmin, createSkill);
router.put('/:id', requireAuth, requireAdmin, updateSkill);
router.delete('/:id', requireAuth, requireAdmin, deleteSkill);

module.exports = router;
