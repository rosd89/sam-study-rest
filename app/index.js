const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger/logger.morgan');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(logger());

const rootV1 = '/api/v1';
const user = require('./api/v1/user/user');

app.use(rootV1 + '/users', user);

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = require('./swagger/def');

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  apis: ['./app/api/v1/user/user.js', './swagger/*.yaml']
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;