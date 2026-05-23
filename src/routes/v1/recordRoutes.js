// src/routes/v1/recordRoutes.js
const express = require('express');
const runtimeController = require('../../controllers/runtimeController');
const authMiddleware = require('../../middleware/auth');

const router = express.Router({ mergeParams: true }); // mergeParams to access appId and entity from parent
router.use(authMiddleware);

router.post('/:entity', runtimeController.createRecord);
router.get('/:entity', runtimeController.getRecords);
router.get('/:entity/:recordId', runtimeController.getRecord);
router.put('/:entity/:recordId', runtimeController.updateRecord);
router.delete('/:entity/:recordId', runtimeController.deleteRecord);

module.exports = router;
