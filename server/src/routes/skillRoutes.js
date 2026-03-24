const express = require('express');
const router = express.Router();
const { getAllSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllSkills);
router.post('/', authMiddleware, createSkill);
router.put('/:id', authMiddleware, updateSkill);
router.delete('/:id', authMiddleware, deleteSkill);

module.exports = router;
