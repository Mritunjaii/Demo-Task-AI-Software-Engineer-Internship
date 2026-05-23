const asyncWrapper = require('../middleware/asyncWrapper.js');
const entityService = require('../services/entityService.js');
const { success } = require('../utils/response.js');

exports.createEntity = asyncWrapper(async (req, res) => {
  const { name, schemaJson } = req.body;
  const appId = Number(req.params.appId);
  const entity = await entityService.createEntity(appId, name, schemaJson);
  return success(res, entity, 'Entity created');
});

exports.listEntities = asyncWrapper(async (req, res) => {
  const appId = Number(req.params.appId);
  const { page = 1, limit = 10 } = req.query;
  const result = await entityService.listEntities(appId, Number(page), Number(limit));
  return success(res, result, 'Entities retrieved');
});

exports.getEntity = asyncWrapper(async (req, res) => {
  const appId = Number(req.params.appId);
  const entityId = Number(req.params.entityId);
  const entity = await entityService.getEntityById(appId, entityId);
  return success(res, entity, 'Entity fetched');
});

exports.updateEntity = asyncWrapper(async (req, res) => {
  const appId = Number(req.params.appId);
  const entityId = Number(req.params.entityId);
  const { schemaJson } = req.body;
  const updated = await entityService.updateEntity(appId, entityId, schemaJson);
  return success(res, updated, 'Entity updated');
});

exports.deleteEntity = asyncWrapper(async (req, res) => {
  const appId = Number(req.params.appId);
  const entityId = Number(req.params.entityId);
  await entityService.deleteEntity(appId, entityId);
  return success(res, null, 'Entity deleted');
});
