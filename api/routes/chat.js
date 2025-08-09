const Message = require('../models/message');
const express = require('express');
const router = express.Router();

// GET /api/chats - Get a list of all conversations (unique users)
router.get('/chats', async (req, res) => {
  try {
    const chats = await Message.aggregate([
      {
        $group: {
          _id: '$wa_id',
          lastMessage: { $last: '$text.body' },
          lastTimestamp: { $last: '$timestamp' },
          // For a real app, you might get the user's name from another collection.
          // For now, we'll just return the wa_id.
        }
      },
      {
        $sort: { lastTimestamp: -1 } // Sort by most recent message
      }
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/chats/:waId - Get all messages for a specific conversation
router.get('/chats/:waId', async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.waId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/messages - Add a new message (for our demo sending feature)
router.post('/messages', async (req, res) => {
  const { id, wa_id, text, from_me } = req.body;
  const newMessage = new Message({
    id,
    wa_id,
    text: { body: text },
    from_me,
    timestamp: new Date()
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;