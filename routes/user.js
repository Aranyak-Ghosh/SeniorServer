const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const bodyParser = require('body-parser');

const cred = require("../credentials.json");

mongoose.connect(cred.mongoURL, {
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected');
})

const User = require('../models/userModel');

router.use(bodyParser.urlencoded({
    extended: false
}));

router.post('/login', (req, res) => {
    console.log(req.body);
    res.send('login');
});

router.post('/signUp', (req, res) => {
    User.register(new User({
        username: req.body.email,
        mobile: req.body.mobile
    }), req.body.password).then(data => {
        passport.authenticate("local")(req, res, () => {
            res.redirect('/login');
        });
    }, err => {
        console.log(err);
    })
});

router.get('/resetPassword', (req, res) => {
    res.send('resetPassword');
});

module.exports = router;