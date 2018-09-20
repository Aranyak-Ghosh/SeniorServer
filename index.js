const FitbitApiClient = require("fitbit-node");

const cred = require("./credentials.json");

let client = new FitbitApiClient(cred);

const scope = 'activity heartrate profile sleep weight';

const redirectUrl = 'http://www.aus.edu';

let auth_url = client.getAuthorizeUrl(scope, redirectUrl);

console.log(auth_url);


const express = require("express");

let app = express();

app.get("/",(req,res)=>{
    res.send(auth_url);
})

app.listen(8080, ()=>{
    console.log("Started listening on 8080");
})