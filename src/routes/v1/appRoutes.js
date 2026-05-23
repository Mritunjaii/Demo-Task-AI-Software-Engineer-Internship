// src/routes/v1/appRoutes.js
const express = require('express');
const appController = require('../../controllers/appController');
const authMiddleware = require('../../middleware/auth');

const router = express.Router({ mergeParams: true });
router.use(authMiddleware);
router.post('/', appController.createApp);
router.get('/', appController.listApps);
router.get('/:appId', appController.getApp);
router.put('/:appId', appController.updateApp);
router.delete('/:appId', appController.deleteApp);

module.exports = router;
