const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, messageController.sendMessage);
router.get('/conversations', protect, messageController.getMyConversations);
router.get('/:userId', protect, messageController.getConversation);
router.put('/:userId/read', protect, messageController.markAsRead);

module.exports = router;