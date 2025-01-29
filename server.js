const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const csurf = require('csurf'); // Added CSRF protection
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages'); // Fixed missing import
const profileRoutes = require('./routes/profile'); // Fixed missing import

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(
  session({
    secret: 'yourSecretKey', // Change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Secure in production
  })
);

// CSRF Protection Middleware
const csrfProtection = csurf();
app.use(csrfProtection);

// Middleware to make session and CSRF token available to EJS
app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.userId;
  res.locals.username = req.session.username || null;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);
app.use('/profile', profileRoutes);

// Home Page Route
app.get('/', (req, res) => {
  res.render('index');
});

// Error Handling Middleware
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found', statusCode: 404 });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
