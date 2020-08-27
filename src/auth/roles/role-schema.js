'use strict';

const mongoose = require('mongoose');

const role = new mongoose.Schema({
    roleName: { type: String, required: true },
    permissions: { type: Array, required: true }
})

module.exports = mongoose.model('role', role);