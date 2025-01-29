module.exports = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized access. Please log in.' });
  }
  next();
};
