'use strict';

const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const home = require('./routes/endpoints.js');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', home);

const server = http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}!`);
});

module.exports = { app, server };

server.on('close', () => {
  console.log('HTTP server is closed');
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  throw reason;
});

process.on('uncaughtException', (reason) => {
  if (reason) console.log(reason);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received, closing the server');
  server.close(() => {
    console.log('Server closed');
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received, closing the server');
  server.close(() => {
    console.log('Server closed');
  });
});
