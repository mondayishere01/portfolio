const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        notifyEmail: {
            type: String,
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Settings', settingsSchema);
