require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const SALT_ROUNDS = 10;

const DEFAULT_ADMIN = {
    email: 'admin@portfolio.com',
    password: 'admin123',
};

/**
 * Seeds the database with an initial admin user.
 *
 * Usage:
 *   node server/src/utils/seedAdmin.js
 *
 * If an admin with the default email already exists, the script
 * skips creation and exits cleanly.
 */
const seedAdmin = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

    try {
        await mongoose.connect(mongoUri);
        console.log('✓ Connected to MongoDB');

        const existingAdmin = await Admin.findOne({ email: DEFAULT_ADMIN.email });

        if (existingAdmin) {
            console.log(`⚠ Admin "${DEFAULT_ADMIN.email}" already exists — skipping seed.`);
        } else {
            const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, SALT_ROUNDS);

            await Admin.create({
                email: DEFAULT_ADMIN.email,
                passwordHash,
            });

            console.log(`✓ Admin user created: ${DEFAULT_ADMIN.email}`);
        }
    } catch (err) {
        console.error('✗ Seed failed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('✓ Disconnected from MongoDB');
    }
};

// Run directly when invoked as a standalone script
if (require.main === module) {
    seedAdmin();
}

module.exports = seedAdmin;
