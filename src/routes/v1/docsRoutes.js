'use strict';

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../docs/swagger');

const router = express.Router();

router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Demo Task AI Software Engineer Internship API Docs',
  customCss: `
    .swagger-ui .topbar { background: #212529; }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper::after { content: '⚡ Demo Task API'; color: #ff7043; font-size: 1.2rem; font-weight: bold; }
    .swagger-ui .btn.execute { background: #ff7043; border-color: #ff7043; }
  `,
}));

module.exports = router;
