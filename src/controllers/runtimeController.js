const asyncWrapper = require('../middleware/asyncWrapper.js');
const recordService = require('../services/recordService.js');
const { success } = require('../utils/response.js');

exports.createRecord = asyncWrapper(async (req, res) => {
  const { appId, entity } = req.params; // entity name in URL
  const data = req.body;
  const userId = req.user.id;
  const record = await recordService.createRecord(Number(appId), entity, data, userId);
  return success(res, record, 'Record created');
});

exports.getRecords = asyncWrapper(async (req, res) => {
  const { appId, entity } = req.params;
  const result = await recordService.getRecords(Number(appId), entity, req.query);
  return success(res, result, 'Records fetched');
});

exports.getRecord = asyncWrapper(async (req, res) => {
  const { appId, entity, recordId } = req.params;
  const record = await recordService.getRecordById(Number(appId), entity, recordId);
  return success(res, record, 'Record fetched');
});

exports.updateRecord = asyncWrapper(async (req, res) => {
  const { appId, entity, recordId } = req.params;
  const data = req.body;
  const updated = await recordService.updateRecord(Number(appId), entity, recordId, data);
  return success(res, updated, 'Record updated');
});

exports.deleteRecord = asyncWrapper(async (req, res) => {
  const { appId, entity, recordId } = req.params;
  await recordService.deleteRecord(Number(appId), entity, recordId);
  return success(res, null, 'Record deleted');
});
