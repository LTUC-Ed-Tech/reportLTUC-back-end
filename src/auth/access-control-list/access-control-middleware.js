'use strict';

const users = require('../userSchema');

module.exports = capability => {
    return (req, res, next) => {
        try {
            if (req.user.capabilities.includes(capability)) {
                next();
            } else {
                next('ACCESS DENIED !')
            }
        } catch (e) {
            next('INVALID LOGIN !')
        }
    }
}