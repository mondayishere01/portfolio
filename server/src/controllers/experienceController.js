const Experience = require('../models/Experience');

/**
 * @route   GET /api/experiences
 * @desc    Get all experiences sorted by order ascending
 * @access  Public
 */
const getAllExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ order: 1 });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch experiences' });
    }
};

/**
 * @route   POST /api/experiences
 * @desc    Create a new experience entry
 * @access  Admin
 */
const createExperience = async (req, res) => {
    try {
        const { date, title, company, companyUrl, imageUrl, description, tags, order } = req.body;

        if (!date || !title || !company || !description) {
            return res.status(400).json({
                error: 'Fields date, title, company, and description are required',
            });
        }

        const experience = await Experience.create({
            date,
            title,
            company,
            companyUrl: companyUrl || '',
            imageUrl: imageUrl || '',
            description,
            tags: tags || [],
            order: order ?? 0,
        });

        res.status(201).json(experience);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create experience' });
    }
};

/**
 * @route   PUT /api/experiences/:id
 * @desc    Update an existing experience by ID
 * @access  Admin
 */
const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, title, company, companyUrl, imageUrl, description, tags, order } = req.body;

        const experience = await Experience.findByIdAndUpdate(
            id,
            { date, title, company, companyUrl, imageUrl, description, tags, order },
            { new: true, runValidators: true }
        );

        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        res.json(experience);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update experience' });
    }
};

/**
 * @route   DELETE /api/experiences/:id
 * @desc    Delete an experience by ID
 * @access  Admin
 */
const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const experience = await Experience.findByIdAndDelete(id);

        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        res.json({ message: 'Experience deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete experience' });
    }
};

module.exports = {
    getAllExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
};
