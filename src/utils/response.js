exports.success = function(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ status: 'success', message, data });
}

exports.error = function(res, statusCode, message, details = null) {
  return res.status(statusCode).json({ status: 'error', message, details });
}

class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    this.status = 400;
  }
}
exports.ValidationError = ValidationError;
