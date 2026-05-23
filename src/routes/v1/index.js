'use strict';

const express = require('express');
const authRoutes = require('./authRoutes');
const appRoutes = require('./appRoutes');
const entityRoutes = require('./entityRoutes');
const recordRoutes = require('./recordRoutes');
const docsRoutes = require('./docsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/apps', appRoutes);
router.use('/apps/:appId/entities', entityRoutes);
router.use('/apps/:appId/records', recordRoutes);
router.use('/docs', docsRoutes);

module.exports = router;