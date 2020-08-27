'use strict';

const express = require('express');
const router = express.Router();

const User = require('./auth/userSchema');
const role = require('./auth/roles/role-model')
const pendingUser = require('./auth/pending/pendingUser-model')
const basicAuthMiddleware = require('./auth/basic-auth/basicAuth-middleware');

router.get('/test', test);
router.post('/roleCreatoin', roleCreator);
router.get('/getRoles', getRoles);
router.post('/usertopending', toPending);
router.get('/usertopending', getPending);
router.post('/signup', signUp);
router.post('/signin', basicAuthMiddleware, signIn);

function test(req, res) {
    res.send('hello');
}

function signUp(req, res, next) {
    req.body.user.password = passwordGenerator()
    console.log('requseted user', req.body)
    let user = new User(req.body.user)
    let pendingId = req.body._id
    pendingUser.delete(pendingId)
        .then(() => {
            user.save()
                .then(user => {
                    req.token = user.signupTokenGenerator(user);
                    req.user = user;
                    res.status(200).send(req.token);
                })
                .catch(next)
        })
}

function signIn(req, res, next) {
    res.send(req.token);
}

function getRoles(req, res) {
    role.read()
        .then(role => res.send(role))
}

function roleCreator(req, res, next) {
    role.create(req.body)
        .then(role => res.send(role))
}

function getPending(req, res, next) {
    pendingUser.read()
        .then(response => res.send(response))
}

function toPending(req, res, next) {
    pendingUser.create(req.body)
        .then(user => res.send(user))
}

const passwordGenerator = () => {
    var passLength = 6,
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        retVal = "";

    for (var i = 0, n = charset.length; i < passLength; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return retVal;
}

module.exports = router;