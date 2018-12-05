const express = require("express");
const router = express.Router();

const vitalSchema = require("../models/vitalModel");
const TokenSchema = require("../models/TokenModel");
const severitySchema = require("../models/SeverityModel");

const { exec } = require("child_process");

router.post("/add", (req, res) => {
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
        } else {
          res.status(200).send({ msg: "Stored" });
          let vals = req.body.value;
          if (req.body.type == "Asthma") {
            let command;
            command =
              "cd FIS/evaluateFis/for_redistribution_files_only && evaluateFis " +
              vals["PEF"] +
              " " +
              vals["FEV1"] +
              " " +
              vals["FVC"] +
              " " +
              vals["FEF"];

            logger.verbose(command);

            exec(command, (err, out) => {
              if (!err) {
                console.log(out);
                let severity = new severitySchema({
                  pID: resp.username,
                  type: req.body.type,
                  severity: out,
                  time: Date.now()
                }).save(err => {
                  if (err) {
                    logger.error(
                      `An error occured while uploading Severity to database`
                    );
                    logger.error(err);
                    res.status(500);
                    res.send(err);
                  } else {
                    logger.verbose("Severity Stored on DB");
                  }
                });
              } else {
                console.log(err);
                res.status(500).send("UnexpectedError");
              }
            });
          } else {
            res.status(200).send({ msg: "Stored" });
          }
        }
      });
    }
  });
});

router.post("/getVitals", (req, res) => {
  TokenSchema.findOne({
    token: req.body.token
  }).exec((err, resp) => {
    if (err) {
      logger.error(`An error occurred while finding token`);
      logger.error(err);
      res.status(500).send("InternalError");
    } else {
      vitalSchema
        .find({
          pID: resp.username
        })
        .exec((err, body) => {
          if (err) {
            logger.error("Error occured while finding data");
            logger.error(err);
            res.status(500).send("InternalError");
          } else {
            let response = [];
            body.forEach(val => {
              response.push({
                time: val.time,
                value: val.value
              });
            });
            res.send(response);
          }
        });
    }
  });
});

router.post("/getSeverity", (req, res) => {
  TokenSchema.findOne({
    token: req.body.token
  }).exec((err, resp) => {
    if (err) {
      logger.error(`An error occurred while finding token`);
      logger.error(err);
      res.status(500).send("InternalError");
    } else {
      severitySchema.find({ pID: resp.username }).exec((err, docs) => {
        if (err) {
          logger.error(`An error occurred while finding token`);
          logger.error(err);
          res.status(500).send("InternalError");
        } else {
          let response = [];
          docs.forEach(element => {
            response.push({
              time: element.time,
              severity: element.severity
            });
          });
          res.send(response);
        }
      });
    }
  });
});

module.exports = router;
