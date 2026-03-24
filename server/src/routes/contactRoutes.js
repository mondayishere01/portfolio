const express = require('express');
const router = express.Router();
const {
    submitMessage,
    getAllMessages,
    deleteMessage,
} = require('../controllers/contactController');
const requireAuth = require('../middleware/authMiddleware');

router.post('/', submitMessage);
router.get('/messages', requireAuth, getAllMessages);
router.delete('/messages/:id', requireAuth, deleteMessage);

module.exports = router;
