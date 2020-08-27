'use strict';

require('dotenv').config();
const server = require('./src/server');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

const mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

mongoose.connect(MONGODB_URI, mongoOptions);

server.start(PORT);