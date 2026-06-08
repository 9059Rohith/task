const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all message routes
router.use(authMiddleware);

// GET /api/messages?room=general&page=1&limit=30
router.get('/', async (req, res) => {
  try {
    const { room = 'general', page = 1, limit = 30 } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query = { room, isDeleted: false };

    const totalMessages = await Message.countDocuments(query);
    const totalPages = Math.ceil(totalMessages / limitNum);

    // Fetch newest first for pagination, then we will reverse it to return oldest first
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('sender', 'username');

    // Reverse to get chronological order (oldest -> newest in the fetched chunk)
    messages.reverse();

    res.json({
      messages,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error fetching messages' });
  }
});

// DELETE /api/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    if (message.isDeleted) {
      return res.status(400).json({ error: 'Message is already deleted' });
    }

    message.isDeleted = true;
    await message.save();

    // Emit socket event via req.io if available
    if (req.io) {
      req.io.to(message.room).emit('message:deleted', { messageId });
    }

    res.json({ success: true, messageId });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error deleting message' });
  }
});

module.exports = router;
