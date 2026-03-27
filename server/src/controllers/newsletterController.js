const Newsletter = require('../models/Newsletter');

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to the newsletter
 * @access  Public
 */
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if already subscribed
        let subscription = await Newsletter.findOne({ email });

        if (subscription) {
            if (subscription.active) {
                return res.status(400).json({ error: 'Already subscribed' });
            } else {
                // Re-activate
                subscription.active = true;
                await subscription.save();
                return res.json({ message: 'Re-subscribed successfully' });
            }
        }

        // Create new subscription
        await Newsletter.create({ email });

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Subscription failed' });
    }
};

/**
 * @route   POST /api/newsletter/unsubscribe
 * @desc    Unsubscribe from the newsletter
 * @access  Public
 */
const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        const subscription = await Newsletter.findOneAndUpdate(
            { email },
            { active: false },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json({ message: 'Unsubscribed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Unsubscription failed' });
    }
};

module.exports = { subscribe, unsubscribe };
