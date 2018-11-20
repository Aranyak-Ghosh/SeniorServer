const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const Token = require("../models/TokenModel");

const saltRound = 10;

isLoggedIn = (req, res, next) => {
  logger.verbose(`Checking if user already logged in`);
  if (req.isAuthenticated()) return next();
  else if (req.query.token) return next();
  res.send("login");
};

router.post("/login", (req, res) => {
  logger.verbose(`Logging User in`);
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (!err && doc) {
      try {
        let match = await bcrypt.compare(req.body.password, doc.password);
        if (match) {
          logger.verbose(`Generating token`);
          let token = crypto.randomBytes(64).toString("base64");
          Token.findOneAndUpdate(
            {
              username: req.body.username
            },
            {
              token: token
            },
            {
              upsert: true
            },
            (err, doc, resp) => {
              if (!err && doc) {
                logger.verbose("Updated Token");
                res.send({
                  token
                });
              } else if (err) {
                logger.error(`An error occured while storing token in db`);
                logger.error(err);
                res.status(500);
                res.send("Internal error");
              }
            }
          );
        } else {
          res.send("IncorrectPassword");
        }
      } catch (e) {
        logger.error(e);
        res.status(500);
        res.send("internalError");
      }
    } else if (err) {
      logger.error(err);
      res.status(500);
      res.send("internalError");
    } else {
      logger.error("User Does Not Exist");
      res.send("UserDoesNotExist");
    }
  });
});

router.get("/validateToken", isLoggedIn, (req, res) => {
  logger.verbose(`Validating token sent by client`);
  Token.findOne(
    {
      token: req.query.token
    },
    (err, resp) => {
      if (err) {
        logger.error(`An error occurred while retrieving token from db`);
        logger.error(err);
        res.status(500);
        res.send({
          msg: "Internal error"
        });
      } else if (resp) {
        res.send({
          token: resp.token
        });
      } else {
        res.send({
          status: "invalidToken",
          msg: "Token not found"
        });
      }
    }
  );
});

router.get("/logout", (req, res) => {
  req.logout();
  logger.verbose("Logging out user");

  res.send("logout");
});

router.post("/signUp", async (req, res) => {
  logger.verbose("Creating new user");
  try {
    let hash = await bcrypt.hash(req.body.password, saltRound);
    let user = new User({
      username: req.body.username,
      contactNo: req.body.mobile,
      gender: req.body.gender,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      address: req.body.address,
      password: hash
    }).save(err => {
      if (err) {
        logger.error(err);
        res.status(500).send("InternalError");
      } else {
        res.send("registered");
      }
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send("InternalError");
  }
});

router.get("/resetPassword", (req, res) => {
  res.send("toBeImplemented");
});

module.exports = router;
