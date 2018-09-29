const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const passport = require('passport');

const User = require('../models/userModel');
const Token = require('../models/TokenModel');

isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    else if (req.query.token)
        return next();
    res.send('login');
}

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/home',
    failiureRedirect: 'user/login'
}), (req, res) => {
    res.send('login');
});

router.get('/home', isLoggedIn, (req, res) => {
    if (!req.query.token) {
        let token = crypto.randomBytes(64).toString('base64');
        Token.findOneAndUpdate({
            username: req._passport.session.user || req.query.username
        }, {
            token: token
        }, {
            upsert: true
        }, (err, doc, resp) => {
            if (!err && doc) {
                res.send(token);
            } else if (err) {
                console.log(err);
                res.status(500);
                res.send('Internal error');
            }
        });
    } else {
        Token.findOne({
            token: req.query.token,
            username: req.query.username
        }, (err, resp) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.send('Internal Error');
            } else if (resp) {
                console.log(resp);
                res.send(resp)
            } else {
                res.status(500);
                console.log('Token not found')
            }
        })
    }

});

router.get('/logout', (req, res) => {
    req.logout();
    Token.findOneAndDelete({
        username: req._passport.session.user
    }).exec();
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
            res.send({
                success: true
            });
        });
    }, err => {
        console.log(err);
        res.send(err.message);
    })
});

router.get('/resetPassword', (req, res) => {
    res.send('toBeImplemented');
});


module.exports = router;