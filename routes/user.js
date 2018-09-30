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

// router.options('/login', (req, res) => {
//     res.header('Access-Control-Allow-Methods', 'GET, POST');
//     res.header("Access-Control-Allow-Headers", "Accept, Content-Type");
//     // console.log(res);
//     // res.redirect('/user/login');
//     res.sendStatus(200);
// })

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/user/userexist'
}), (req, res) => {
    let token = crypto.randomBytes(64).toString('base64');
    Token.findOneAndUpdate({
        username: req._passport.session.user || req.query.username
    }, {
        token: token
    }, {
        upsert: true
    }, (err, doc, resp) => {
        if (!err && doc) {
            res.send({
                token
            });
        } else if (err) {
            console.log(err);
            res.status(500);
            res.send({
                msg: 'Internal error'
            });
        }
    });
});

router.get('/userexist', (req, res) => {
    res.send({
        msg: 'CheckIfUserExists'
    });
})

router.get('/validateToken', isLoggedIn, (req, res) => {
    Token.findOne({
        token: req.query.token,
    }, (err, resp) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send({
                msg: 'Internal error'
            });
        } else if (resp) {
            console.log(resp);
            res.send({
                token: resp.token
            });
        } else {
            res.status(404);
            console.log({
                msg: 'Token not found'
            })
        }
    })


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