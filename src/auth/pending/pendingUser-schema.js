'use strict';

const mongoose = require('mongoose')

const pending = new mongoose.Schema({
    user: { type: Object, required: true }
})

module.exports = mongoose.model('pending', pending);