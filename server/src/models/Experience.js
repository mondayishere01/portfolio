const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: [true, 'Date range is required'],
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        companyUrl: {
            type: String,
            trim: true,
            default: '',
        },
        imageUrl: {
            type: String,
            trim: true,
            default: '',
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Experience', experienceSchema);
