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

router.post('/active', getActive);
router.get('/download', printData);
router.post('/data', getStudentData);


// app.get('/report', postReportStudentData);

/****** FUNCTIONS PART ******/

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

function getActive(req, res) {
    console.log("term ():", req.body.term)
    superagent.get(`https://sisclientweb-test-100533.campusnexus.cloud/ds/odata/StudentCourses?$filter=Term/Code%20eq%20%27${req.body.term}%27&$select=Id,ClockHoursEarned,CreditHoursEarned&$expand=Student($select=StudentNumber,FirstName,LastName),Enrollment($select=EnrollmentNumber;$expand=Student($select=FullName),ProgramVersion($select=IsActive,ClockHoursRequired,CreditHoursRequired,Name)),Term($select=Name,Code)`)
        .auth('Asharora', 'P@ssword1')
        .then(data => res.send(data.body))
        .catch(e => {
            console.log('Error Massages', e.massage);
        })
}

function getStudentData(req, res) {
    let leadId = req.body.leadId;
    console.log("req.body () :", req.body.leadId);
    let urlAPI = `https://crmclientweb-test-100533.campusnexus.cloud/NexusCrmODataFeed/Leads?IsAudit=undefined&$count=true&$select=LeadId,Name,Email,Mobile&$expand=NavigationNationalityId($select=NationalityDescrip,Name)&$filter=LeadId%20eq%20${leadId}`
    superagent.get(urlAPI)
        .auth('asharora', 'P@ssword1')
        .then(data => res.send(data.body))
        .catch(e => {
            console.log('Error Massages', e.massage);
        })
}

function printData(req, res) {
    superagent.post('https://as-har.jsreportonline.net/api/report')
        .auth('asharoran96@gmail.com', 'Ashar@@@@@1')
        .set('Content-Type', 'application/json')
        .send({
            template: { shortid: "SyeO-uoDGw" },
            data: req.body
        })
        .pipe(res)
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