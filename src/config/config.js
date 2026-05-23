const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, 
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
};

module.exports = config;
