const express = require('express');
const bcrypt = require('bcryptjs');
const { runQuery, getQuery } = require('../db/database');
const router = express.Router();

// Middleware for CSRF protection
const csrf = require('csurf');
const csrfProtection = csrf();

// Render Registration Page
router.get('/register', csrfProtection, (req, res) => {
  res.render('register', { csrfToken: req.csrfToken(), error:'' });
});

// Render Login Page
router.get('/login', csrfProtection, (req, res) => {
  res.render('login', { csrfToken: req.csrfToken(), error: '' });
});

// Handle Registration
router.post('/register', csrfProtection, async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render('register', { csrfToken: req.csrfToken(), error: 'All fields are required', success: '' });
  }

  try {
    const existingUser = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await runQuery('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
      [username, email, hashedPassword]);

      return res.render('register', { 
        csrfToken: req.csrfToken(), 
        error: '', 
        success: 'Registration successful! You can now <a href="/auth/login">log in</a>.' 
      });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.render('register', { csrfToken: req.csrfToken(), error: 'Internal Server Error', success: '' });
  }
});

// Handle Login
router.post('/login', csrfProtection, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { csrfToken: req.csrfToken(), error: 'Email and password are required' });
  }

  try {
    const user = await getQuery('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.render('login', {csrfToken: req.csrfToken(), error: 'Invalid email or password'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render('login', {csrfToken:req.csrfToken(), error: 'Invalid email or password' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.createdAt = user.created_at;

    res.redirect('/profile');

  } catch (error) {
    console.error('Login Error:', error);
    res.render('login', {csrfToken: req.csrfToken(), error: 'Internal Server Error' });
  }
});

// Handle Logout (CSRF Protected)
router.post('/logout', csrfProtection, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
