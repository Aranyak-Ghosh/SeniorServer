const express = require('express');
const FitbitApiClient = require('fitbit-node');
const router = express.Router();

const cred = require("../credentials.json");

let code = cred.code;

delete cred.code;

let client = new FitbitApiClient(cred);

const scope = 'activity heartrate profile sleep weight';

const redirectUrl = 'http://localhost:8080/fitbit/accessToken';

let auth_url = client.getAuthorizeUrl(scope, redirectUrl);

router.get('/auth_url', (req, res) => {
    res.send(auth_url);
})

router.get('/accessToken', async (req, res) => {
    try {
        let token = await client.getAccessToken(req.query.code, redirectUrl);
        res.send(token);
    } catch (err) {
        console.error(err);
    }
});

router.get('/heartRate', async (req, res) => {
    let response = await client.get('/activities/heart/date/today/1d.json', req.query.token, '-');
    console.log(response);
    res.send(response);
});

module.exports = router;