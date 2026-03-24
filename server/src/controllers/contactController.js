const ContactMessage = require('../models/ContactMessage');

/**
 * @route   POST /api/contact
 * @desc    Submit a new contact form message
 * @access  Public
 */
const submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'Fields name, email, and message are required',
            });
        }

        const contactMessage = await ContactMessage.create({ name, email, message });
        res.status(201).json({ message: 'Message sent successfully', id: contactMessage._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

/**
 * @route   GET /api/contact/messages
 * @desc    Get all contact messages sorted by newest first
 * @access  Admin
 */
const getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

/**
 * @route   DELETE /api/contact/messages/:id
 * @desc    Delete a contact message by ID
 * @access  Admin
 */
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const contactMessage = await ContactMessage.findByIdAndDelete(id);

        if (!contactMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

module.exports = { submitMessage, getAllMessages, deleteMessage };
