const asyncWrapper = require('../middleware/asyncWrapper.js');
const authService = require('../services/authService.js');
const { success, error } = require('../utils/response.js');

exports.register = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.registerUser(email, password);
  return success(res, user, 'User registered', 201);
});

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  return success(res, result, 'Login successful');
});

exports.me = asyncWrapper(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  return success(res, user, 'Profile fetched');
});
