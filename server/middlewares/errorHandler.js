
const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Server Error';

  // Log full error details
  logger.error(`Error: ${error.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return sendError(res, 'Resource not found', 404);
  }

  // Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already exists`;
    return sendError(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = err.errors
      ? Object.values(err.errors).map(val => ({
          field: val.path,
          message: val.message
        }))
      : [{ message: err.message }];
    return sendError(res, 'Validation Error', 400, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 401);
  }

  // Default fallback
  return sendError(res, error.message, error.statusCode || 500);
};

const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(message, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  sendError(res, message, 404);
};

module.exports = {
  errorHandler,
  notFound
};
