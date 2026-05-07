const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    return next(new AppError('Not authenticated. Please login.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return next(new AppError('Invalid or expired token.', 401));
  }
};

module.exports = protect;