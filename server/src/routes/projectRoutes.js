const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const requireAuth = require('../middleware/authMiddleware');

router.get('/', getAllProjects);
router.post('/', requireAuth, createProject);
router.put('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);

module.exports = router;
