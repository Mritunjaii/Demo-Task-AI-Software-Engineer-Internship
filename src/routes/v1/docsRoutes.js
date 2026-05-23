'use strict';

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../docs/swagger');

const router = express.Router();

router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

router.use(
  '/',
  swaggerUi.serveFiles(swaggerSpec),
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Demo Task API Docs',
    customCss: `
      .swagger-ui .topbar {
        background: #212529;
      }

      .swagger-ui .topbar-wrapper::after {
        content: '⚡ Demo Task API';
        color: #ff7043;
        font-size: 1.2rem;
        font-weight: bold;
      }
    `,
  })
);

module.exports = router;