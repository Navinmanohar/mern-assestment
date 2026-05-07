const AppError = require('../utils/AppError');

const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

const errorHandler = (err, req, res, _next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return errorResponse(res, 400, message);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 409, `${field} already exists`);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, 404, 'Invalid ID format');
  }

  errorResponse(res, 500, 'Internal server error');
};

module.exports = errorHandler;
