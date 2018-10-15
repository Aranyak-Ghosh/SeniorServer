const express = require('express');
const FitbitApiClient = require('fitbit-node');
const router = express.Router();

const cred = require("../credentials.json");

let client = new FitbitApiClient(cred.fitbit);

const scope = 'activity heartrate profile sleep weight';

const redirectUrl = 'http://10.25.147.115:8080/fitbit/accessToken';

let auth_url = client.getAuthorizeUrl(scope, redirectUrl);

let token;

router.get('/auth_url', (req, res) => {
    res.send({
        auth_url
    });
})

router.get('/accessToken', async (req, res) => {
    try {
        token = await client.getAccessToken(req.query.code, redirectUrl);
        res.send('<h1>You may close this tab now</h1>');
    } catch (err) {
        console.error(err);
    }
});

router.get('/getToken', (req, res) => {
    if (token)
        res.send(token);
    else
        res.send({
            msg: 'Token not available'
        });
});

// router.get('/heartRate', async (req, res) => {
//     let response = await client.get('/activities/heart/date/today/1d.json', req.query.token, '-');
//     console.log(response);
//     res.send(response);
// });

    router.post('/refreshToken', async (req,res)=>{
        let data=await client.refreshAccessToken(req.body.accessToken,req.body.refreshToken);
        console.log(data);
        res.send(data);
    })

router.get('/sleep', async (req, res) => {
    let response = await client.get(`/sleep/date/${req.query.date}.json`, req.query.token, '-');
    console.log(response);
    res.send(response);
})

module.exports = router;