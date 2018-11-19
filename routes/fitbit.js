const express = require("express");
const FitbitApiClient = require("fitbit-node");
const router = express.Router();

const cred = require("../credentials.json");

let fitbitCred = {
  clientId: process.env.fitbitClientId || cred.fitbit.clientId,
  clientSecret: process.env.fitbitClientSecred || cred.fitbit.clientSecret
};

let client = new FitbitApiClient(fitbitCred);

const scope = "activity heartrate profile sleep weight";

const redirectUrl =
  "https://respiconnect.herokuapp.com/fitbit/accessToken";
// "http://192.168.1.108:8080/fitbit/accessToken";

let auth_url = client.getAuthorizeUrl(scope, redirectUrl);

let token;

router.get("/auth_url", (req, res) => {
  logger.verbose(`Sending AUTH_URL to client`);
  res.send({
    auth_url
  });
});

router.get("/accessToken", async (req, res) => {
  try {
    token = await client.getAccessToken(req.query.code, redirectUrl);
    res.send("<h1>You may close this tab now</h1>");
  } catch (err) {
    logger.error(err);
    res.status(500).send("InternalError");
  }
});

router.get("/getToken", (req, res) => {
  if (token) res.send(token);
  else
    res.send({
      msg: "Token not available"
    });
});

router.post("/refreshToken", async (req, res) => {
  try {
    let data = await client.refreshAccessToken(
      req.body.accessToken,
      req.body.refreshToken
    );
    res.send(data);
  } catch (err) {
    logger.error(err);
    res.status(500).send("InternalError");
  }
});

router.get("/sleep", async (req, res) => {
  try {
    let response = await client.get(
      `/sleep/date/${req.query.date}.json`,
      req.query.token,
      "-"
    );
    if (response && response.length) res.send(response[0]["sleep"]);
    else throw new Error("Invalid Response");
  } catch (err) {
    logger.error(err);
    res.status(500).send("InternalError");
  }
});

router.get("/heartrate", async (req, res) => {
  try {
    let response = await client.get(
      `/activities/heart/date/${req.query.date}/1d/1min.json`,
      req.query.token,
      "-"
    );
    if (response && response.length)
      res.send(response[0]["activities-heart-intraday"]);
    else throw new Error("Invalid Response");
  } catch (err) {
    logger.error(err);
    res.status(500).send("InternalError");
  }
});

module.exports = router;
