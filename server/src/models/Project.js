const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Project description is required'],
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
            default: '',
        },
        link: {
            type: String,
            trim: true,
            default: '',
        },
        tags: {
            type: [String],
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
        year: {
            type: Number,
            default: () => new Date().getFullYear(),
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', projectSchema);
