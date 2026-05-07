const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Not authenticated. Please login.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      return next(new AppError('Session expired. Please login again.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return next(new AppError('Invalid or expired token.', 401));
  }
};

module.exports = protect;
