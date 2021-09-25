const errorHandler = (res, statusCode = 400, text) => res.status(statusCode).json({
  status: statusCode,
  error: text,
});

module.exports = errorHandler;