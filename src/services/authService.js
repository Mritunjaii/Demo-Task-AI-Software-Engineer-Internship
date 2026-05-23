const prisma = require('../prisma/client.js');
const { hashPassword, comparePassword } = require('../utils/hash.js');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const { ValidationError } = require('../utils/response.js');

exports.registerUser = async function(email, password) {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ValidationError('Email already in use');
  }
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed },
    select: { id: true, email: true },
  });
  return user;
}

exports.loginUser = async function(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ValidationError('Invalid credentials');
  }
  const match = await comparePassword(password, user.password);
  if (!match) {
    throw new ValidationError('Invalid credentials');
  }
  const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  return { token, user: { id: user.id, email: user.email } };
}

exports.getProfile = async function(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });
  if (!user) {
    throw new ValidationError('User not found');
  }
  return user;
}
