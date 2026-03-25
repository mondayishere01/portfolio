const Skill = require('../models/Skill');

const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
};

const createSkill = async (req, res) => {
    try {
        const { name, category, proficiency, imageUrl } = req.body;
        if (!name || !category) {
            return res.status(400).json({ error: 'Name and category are required' });
        }
        const skill = await Skill.create({ name, category, proficiency: proficiency || 3, imageUrl: imageUrl || '' });
        res.status(201).json(skill);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create skill' });
    }
};

const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, proficiency, imageUrl } = req.body;
        const skill = await Skill.findByIdAndUpdate(id, { name, category, proficiency, imageUrl }, { new: true, runValidators: true });
        if (!skill) return res.status(404).json({ error: 'Skill not found' });
        res.json(skill);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update skill' });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findByIdAndDelete(id);
        if (!skill) return res.status(404).json({ error: 'Skill not found' });
        res.json({ message: 'Skill deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete skill' });
    }
};

const getSkillCategories = async (req, res) => {
    try {
        res.json(Skill.SKILL_CATEGORIES);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

module.exports = { getAllSkills, createSkill, updateSkill, deleteSkill, getSkillCategories };
