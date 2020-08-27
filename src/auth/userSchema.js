'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const users = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
});

users.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await brcypt.hash(this.password, 5)
    }
    return Promise.reject();
})

users.statics.authenticater = function (authorizedUser) {
    let query = { username: authorizedUser.username }
    return this.findOne(query)
        .then(user => {
            return user.passwordComparator(authorizedUser.password)
        })
        .catch(e => {
            console.errore('error message', e.message);
        })
}

users.methods.passwordComparator = function (userPassword) {
    return brcypt.compare(userPassword, this.password)
        .then(validUser => {
            return validUser ? this : null;
        });
};

users.methods.signupTokenGenerator = function (user) {
    let token = {
        id: user._id,
        username: user.username,
        password: user.password,
        role: user.role,
    };

    return jwt.sign(token, SECRET);
};

users.statics.signinTokenGenerator = function (user) {
    let token = {
        id: user._id,
        username: user.username,
        password: user.password,
        role: user.role,
    };
    return jwt.sign(token, SECRET);
};

users.statics.authenticateToken = async (token) => {
    try {
        let tokenObj = jwt.verify(token, SECRET);
        if (tokenObj) {
            return Promise.resolve(tokenObj)
        } else {
            return Promise.reject();
        }
    } catch (e) {
        return Promise.reject();
    }
}

module.exports = mongoose.model('users', users);