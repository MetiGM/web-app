const express = require('express');
const { runQuery, allQuery } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get All Messages (For Logged-in User)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Fetch user messages
    const messages = await allQuery('SELECT content, created_at FROM messages WHERE user_id = ?', [userId]);

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Post a New Message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { content } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty' });
    }

    // Insert message into database
    await runQuery('INSERT INTO messages (user_id, content) VALUES (?, ?)', [userId, content]);

    res.status(201).json({ message: 'Message posted successfully' });
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
