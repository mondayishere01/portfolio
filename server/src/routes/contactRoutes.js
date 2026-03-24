const express = require('express');
const router = express.Router();
const {
    submitMessage,
    getAllMessages,
    deleteMessage,
} = require('../controllers/contactController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', submitMessage);
router.get('/messages', requireAuth, requireAdmin, getAllMessages);
router.delete('/messages/:id', requireAuth, requireAdmin, deleteMessage);

module.exports = router;
