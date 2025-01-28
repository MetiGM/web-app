const express = require('express');
const bcrypt = require('bcryptjs');
const { runQuery, getQuery } = require('../db/database');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert new user
    const result = await runQuery('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
    [username, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully', userId: result.id });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Fetch user from database
  const user = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Store session
  req.session.userId = user.id;
  req.session.username = user.username;

  res.status(200).json({ message: 'Login successful' });
});

// User Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
