const { ValidationError } = require('../utils/response');

module.exports = function (err, req, res, next) {
  console.error(err);
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message, details: err.details });
  }
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Unique constraint violation', meta: err.meta });
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};
