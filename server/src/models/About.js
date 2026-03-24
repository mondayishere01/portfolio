const mongoose = require('mongoose');

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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('About', aboutSchema);
