const express = require('express');
const bcrypt = require('bcryptjs');
const { runQuery, getQuery } = require('../db/database');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Insert the new user into the database
    const result = await runQuery('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      hashedPassword,
    ]);
    res.status(201).json({ message: 'User registered successfully', userId: result.id });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Get the user from the database
  const user = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Set session for the logged-in user
  req.session.userId = user.id;
  req.session.username = user.username;

  res.status(200).json({ message: 'Login successful' });
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
