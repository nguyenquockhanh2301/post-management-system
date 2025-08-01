const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.path.includes('/auth')) return next();

  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
