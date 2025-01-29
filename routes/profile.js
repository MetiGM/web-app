const express = require('express');
const { getQuery, allQuery } = require('../db/database');
const authMiddleware = require('../middleware/auth');
const csrf = require('csurf');

const router = express.Router();
const csrfProtection = csrf();

// Profile Route (Requires Authentication)
router.get('/', authMiddleware, csrfProtection, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Fetch user details
    const user = await getQuery('SELECT username, email, created_at FROM users WHERE id = ?', [userId]);

    if (!user) {
      return res.status(404).render('error', { message: 'User not found', statusCode: 404 });
    }

    // Fetch user messages
    const messages = await allQuery('SELECT content, created_at FROM messages WHERE user_id = ?', [userId]);

    // Render profile page
    res.render('profile', {
      username: user.username,
      email: user.email,
      createdAt: user.created_at,
      messages: messages,
      csrfToken: req.csrfToken(),
    });

  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).render('error', { message: 'Internal Server Error', statusCode: 500 });
  }
});

module.exports = router;
