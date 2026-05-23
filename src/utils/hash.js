'use strict';

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt.
 * @param {string} password - Plain-text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password with a hashed one.
 * @param {string} password - Plain-text password
 * @param {string} hash - Bcrypt hash
 * @returns {Promise<boolean>}
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
