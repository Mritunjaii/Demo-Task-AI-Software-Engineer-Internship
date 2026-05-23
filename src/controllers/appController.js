const asyncWrapper = require('../middleware/asyncWrapper.js');
const appService = require('../services/appService.js');
const { success } = require('../utils/response.js');

exports.createApp = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const ownerId = req.user.id;
  const app = await appService.createApp(name, ownerId);
  return success(res, app, 'App created');
});

exports.listApps = asyncWrapper(async (req, res) => {
  const ownerId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const result = await appService.getAppsByOwner(ownerId, Number(page), Number(limit));
  return success(res, result, 'Apps retrieved');
});

exports.getApp = asyncWrapper(async (req, res) => {
  const ownerId = req.user.id;
  const { appId } = req.params;
  const app = await appService.getAppById(Number(appId), ownerId);
  return success(res, app, 'App fetched');
});

exports.updateApp = asyncWrapper(async (req, res) => {
  const ownerId = req.user.id;
  const { appId } = req.params;
  const { name } = req.body;
  const updated = await appService.updateApp(Number(appId), ownerId, { name });
  return success(res, updated, 'App updated');
});

exports.deleteApp = asyncWrapper(async (req, res) => {
  const ownerId = req.user.id;
  const { appId } = req.params;
  await appService.deleteApp(Number(appId), ownerId);
  return success(res, null, 'App deleted');
});
