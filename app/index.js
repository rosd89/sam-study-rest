const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

const rootV1 = '/api/v1';
const user = require('./api/v1/user/user');

app.use(rootV1 + '/users', user);

module.exports = app;