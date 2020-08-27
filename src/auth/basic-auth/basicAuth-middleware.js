'use strit';

const base64 = require('base-64');
const users = require('../userSchema');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        console.log('headers', req.headers.authorization)
        next('INVALID LOGIN!');
        return;
    }

    let basic = req.headers.authorization.split(' ').pop();

    let [username, password] = base64.decode(basic).split(':');
    let authorizedUser = { username, password };

    users.authenticater(authorizedUser)
        .then(validUser => {
            // console.log('token', validUser)
            req.token = users.signinTokenGenerator(validUser);
            next();
        })
}