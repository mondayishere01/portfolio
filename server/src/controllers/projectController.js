const Project = require('../models/Project');

/**
 * @route   GET /api/projects
 * @desc    Get all projects, optionally filtered by ?featured=true
 * @access  Public
 */
const getAllProjects = async (req, res) => {
    try {
        const filter = {};

        if (req.query.featured === 'true') {
            filter.featured = true;
        }

        const projects = await Project.find(filter).sort({ year: -1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Admin
 */
const createProject = async (req, res) => {
    try {
        const { title, description, imageUrl, link, tags, featured, year } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                error: 'Fields title and description are required',
            });
        }

        const project = await Project.create({
            title,
            description,
            imageUrl: imageUrl || '',
            link: link || '',
            tags: tags || [],
            featured: featured ?? false,
            year: year || new Date().getFullYear(),
        });

        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create project' });
    }
};

/**
 * @route   PUT /api/projects/:id
 * @desc    Update an existing project by ID
 * @access  Admin
 */
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, imageUrl, link, tags, featured, year } = req.body;

        const project = await Project.findByIdAndUpdate(
            id,
            { title, description, imageUrl, link, tags, featured, year },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update project' });
    }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project by ID
 * @access  Admin
 */
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};

module.exports = {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
};
