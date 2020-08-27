'use strict';

const schema = require('./role-schema')
const CRUD = require('../crud')

class Roles extends CRUD { }

module.exports = new Roles(schema);