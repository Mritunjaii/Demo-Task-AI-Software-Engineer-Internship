'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { requestLogger } = require('./middleware/requestLogger');
const { helmetMiddleware } = require('./middleware/helmet');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmetMiddleware);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Dynamic Entity API. Please use the /api endpoints.' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI:    http://localhost:${PORT}/api/v1/docs`);
});

module.exports = app;