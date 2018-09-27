const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const bodyParser = require('body-parser');

const cred = require("../credentials.json");

mongoose.connect(cred.mongoURL, {
    useNewUrlParser: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected');
})

const User = require('../models/userModel');

isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.send('login');
}

router.post('/login', passport.authenticate('local', { successRedirect: '/user/home', failiureRedirect: 'user/login' }), (req, res) => {
    console.log(req.body);
    res.send('login');
});

router.get('/home', isLoggedIn, (req, res) => {
    res.send('home');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.send('logout')
});

router.post('/signUp', (req, res) => {
    User.register(new User({
        username: req.body.email,
        contactNo: req.body.mobile,
        gender: req.body.gender,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        address: req.body.address
    }), req.body.password).then(data => {
        passport.authenticate("local")(req, res, () => {
            res.send({ success: true });
        });
    }, err => {
        console.log(err);
        res.send(err.message);
    })
});

router.get('/resetPassword', (req, res) => {
    res.send('resetPassword');
});


module.exports = router;