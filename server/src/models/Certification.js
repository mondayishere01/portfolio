const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Certification title is required'],
            trim: true,
        },
        credentialUrl: {
            type: String,
            trim: true,
            default: '',
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

module.exports = mongoose.model('Certification', certificationSchema);
