const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: 'yourSecretKey', // Change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` in production with HTTPS
  })
);

// Routes
app.use('/auth', authRoutes);

// Simple test route to check if user is logged in
app.get('/profile', (req, res) => {
  if (req.session.userId) {
    res.json({ message: `Welcome ${req.session.username}!` });
  } else {
    res.status(401).json({ error: 'You must be logged in to access this page.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
