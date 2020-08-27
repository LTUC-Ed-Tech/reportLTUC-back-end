'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const morgan = require('morgan');

const router = require('./route');

const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(router);
app.use(morgan('dev'));


module.exports = {
    server: app,
    start: port => {
        const PORT = port || process.env.PORT || 3030;
        app.listen(PORT, console.log(`Running on ${PORT}`))
    }
}