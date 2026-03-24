const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllProjects);
router.post('/', requireAuth, requireAdmin, createProject);
router.put('/:id', requireAuth, requireAdmin, updateProject);
router.delete('/:id', requireAuth, requireAdmin, deleteProject);

module.exports = router;
