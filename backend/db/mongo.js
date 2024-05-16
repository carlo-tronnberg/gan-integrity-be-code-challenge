'use strict';

const { MongoClient } = require('mongodb');

const mongoDbUri = `mongodb://mongodb:27017/ganChallengeDb`;

const mongoClient = new MongoClient(mongoDbUri, { useUnifiedTopology: true });
mongoClient.connect();
const mongodb = mongoClient.db();

module.exports = mongodb;
