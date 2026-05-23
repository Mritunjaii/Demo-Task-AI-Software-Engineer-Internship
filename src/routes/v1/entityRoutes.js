// src/routes/v1/entityRoutes.js
const express = require('express');
const entityController = require('../../controllers/entityController');
const authMiddleware = require('../../middleware/auth');

const router = express.Router({ mergeParams: true }); // mergeParams to access appId from parent
router.use(authMiddleware);
router.post('/', entityController.createEntity);
router.get('/', entityController.listEntities);
router.get('/:entityId', entityController.getEntity);
router.put('/:entityId', entityController.updateEntity);
router.delete('/:entityId', entityController.deleteEntity);

module.exports = router;
