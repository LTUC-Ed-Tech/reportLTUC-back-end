'use strict';

const schema = require('./pendingUser-schema')
const CRUD = require('../crud')

class Pending extends CRUD { }

module.exports = new Pending(schema)