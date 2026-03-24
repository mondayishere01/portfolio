const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            enum: ['admin', 'author'],
            default: 'author',
        },
        imageUrl: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
            maxLength: 500,
        },
        socialLinks: [
            {
                platform: { type: String, required: true },
                url: { type: String, required: true },
            },
        ],
    },
    {
        timestamps: true,
    }
);

/**
 * Compare a plain-text candidate against the stored hash.
 * @param {string} candidatePassword - The plain-text password to verify.
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
