const express = require("express");
const router = express.Router();

const vitalSchema = require("../models/vitalModel");
const TokenSchema = require("../models/TokenModel");

router.post("/add", (req, res) => {
  // req.body.token
  logger.verbose(`Adding vital to db`);

  TokenSchema.findOne({
    token: req.body.token
  }).exec((err, resp) => {
    if (err) {
      logger.error(`An error occurred while finding token`);
      logger.error(err);
      res.status(500);
      res.send("Internal error");
    } else if (resp) {
      new vitalSchema({
        pID: resp.username,
        type: req.body.type,
        value: req.body.value,
        time: Date.now()
      }).save(err => {
        if (err) {
          logger.error(`An error occured while uploading vital to database`);
          logger.error(err);
          res.status(500);
          res.send(err);
        } else res.send(true);
      });
    }
  });
});

router.post("/get/:startdate/:enddate", (req, res) => {
  TokenSchema.findOne({
    token: req.body.token
  }).exec((err, resp) => {
    if (err) {
      logger.error(`An error occurred while finding token`);
      logger.error(err);
      // console.log()
    }
  });
});

module.exports = router;
