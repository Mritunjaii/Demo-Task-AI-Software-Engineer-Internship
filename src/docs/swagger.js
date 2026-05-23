'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demo Task API',
      version: '1.0.0',
      description: 'A metadata-driven runtime API for managing entities and records dynamically.',
    },
    servers: [
      {
        url: 'https://demo-task-ai-software-engineeer-int.vercel.app/api/v1',
        description: 'Production server',
      },{
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Apps', description: 'App management' },
      { name: 'Entities', description: 'Entity schema management' },
      { name: 'Records', description: 'Dynamic record CRUD' },
    ],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', minLength: 6, example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User created successfully' },
            400: { description: 'Validation error' },
            409: { description: 'Email already in use' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and get JWT token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful, returns JWT token' },
            400: { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user profile',
          responses: {
            200: { description: 'User profile' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/apps': {
        get: {
          tags: ['Apps'],
          summary: 'List all apps for the current user',
          responses: { 200: { description: 'List of apps' }, 401: { description: 'Unauthorized' } },
        },
        post: {
          tags: ['Apps'],
          summary: 'Create a new app',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: { name: { type: 'string', example: 'My App' } },
                },
              },
            },
          },
          responses: { 201: { description: 'App created' }, 400: { description: 'Validation error' } },
        },
      },
      '/apps/{appId}': {
        get: { tags: ['Apps'], summary: 'Get app by ID', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'App details' }, 404: { description: 'Not found' } } },
        put: { tags: ['Apps'], summary: 'Update app', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } } } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Apps'], summary: 'Delete app', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/apps/{appId}/entities': {
        get: { tags: ['Entities'], summary: 'List entities for an app', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'List of entities' } } },
        post: {
          tags: ['Entities'],
          summary: 'Create a new entity schema',
          parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'schemaJson'],
                  properties: {
                    name: { type: 'string', example: 'products' },
                    schemaJson: {
                      type: 'object',
                      example: { fields: [{ name: 'title', type: 'text', required: true }, { name: 'price', type: 'number', required: true }] },
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Entity created' } },
        },
      },
      '/apps/{appId}/entities/{entityId}': {
        get: { tags: ['Entities'], summary: 'Get entity by ID', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'entityId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Entity details' } } },
        put: { tags: ['Entities'], summary: 'Update entity schema', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'entityId', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { schemaJson: { type: 'object' } } } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Entities'], summary: 'Delete entity', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'entityId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
      },
      '/apps/{appId}/records/{entity}': {
        get: { tags: ['Records'], summary: 'List records for an entity', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'entity', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'List of records' } } },
        post: { tags: ['Records'], summary: 'Create a record', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'entity', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 201: { description: 'Record created' } } },
      },
      '/apps/{appId}/records/{entity}/{recordId}': {
        get: { tags: ['Records'], summary: 'Get record by ID', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'entity', in: 'path', required: true, schema: { type: 'string' } }, { name: 'recordId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Record' } } },
        put: { tags: ['Records'], summary: 'Update record', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'entity', in: 'path', required: true, schema: { type: 'string' } }, { name: 'recordId', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
        delete: { tags: ['Records'], summary: 'Delete record', parameters: [{ name: 'appId', in: 'path', required: true, schema: { type: 'integer' } }, { name: 'entity', in: 'path', required: true, schema: { type: 'string' } }, { name: 'recordId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
