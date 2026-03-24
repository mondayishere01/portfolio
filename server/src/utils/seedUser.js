require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SALT_ROUNDS = 10;

const DEFAULT_ADMIN = {
    name: 'Devesh Pandey',
    email: 'Devesh@version.prime', // User will change this to their real email if needed
    password: 'Version1A',
    role: 'admin',
};

/**
 * Seeds the database with an initial admin user.
 */
const seedUser = async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

    try {
        await mongoose.connect(mongoUri);
        console.log('✓ Connected to MongoDB');

        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log(`⚠ Admin user already exists (Email: ${existingAdmin.email}) — skipping seed.`);
        } else {
            const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, SALT_ROUNDS);

            await User.create({
                name: DEFAULT_ADMIN.name,
                email: DEFAULT_ADMIN.email,
                passwordHash,
                role: 'admin'
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
    seedUser();
}

module.exports = seedUser;
