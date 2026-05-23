const morgan = require('morgan');
const config = require('../config/config.js');

exports.requestLogger = morgan('combined', {
  skip: (req) => req.path.startsWith('/public') || req.path.startsWith('/api/docs'),
});
