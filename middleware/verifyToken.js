const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (req.path.includes('/auth')) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'No token' });

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
