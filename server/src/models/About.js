const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
}, { _id: false });

const aboutSchema = new mongoose.Schema(
    {
        bio: {
            type: String,
            required: [true, 'Bio text is required'],
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
            default: '',
        },
        resumeUrl: {
            type: String,
            trim: true,
            default: '',
        },
        socialLinks: {
            type: [socialLinkSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('About', aboutSchema);
