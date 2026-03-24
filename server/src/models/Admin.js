const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required'],
        },
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
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = mongoose.model('Admin', adminSchema);
