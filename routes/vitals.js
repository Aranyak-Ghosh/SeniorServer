const express = require('express');
const router = express.Router();

const vitalSchema = require('../models/vitalModel');
const TokenSchema = require('../models/TokenModel');

router.post('/add', (req, res) => {
    // req.body.token
    TokenSchema.findOne({
        token: req.body.token
    }).exec((err, resp) => {
        if (err) {
            console.log(err);
            res.status(500);
            res.send('Internal error');
        } else if (resp) {
            new vitalSchema({
                pID: resp.username,
                type: req.body.type,
                value: req.body.value,
                time: Date.now()
            });
        }
    });
});