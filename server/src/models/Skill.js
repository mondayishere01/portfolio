const mongoose = require('mongoose');

const SKILL_CATEGORIES = [
    'Languages',
    'Frontend',
    'Backend',
    'Databases',
    'Cloud & DevOps',
    'Tools & Practices',
];

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Skill name is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: SKILL_CATEGORIES,
        },
        proficiency: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 3,
        },
        imageUrl: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Skill', skillSchema);
module.exports.SKILL_CATEGORIES = SKILL_CATEGORIES;
