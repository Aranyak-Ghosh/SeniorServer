process.on("uncaughtException", function(error) {
  if (error && error.stack) {
    console.error("uncaughtException: " + error.stack);
  } else {
    console.error("uncaughtException: " + error);
  }
});

process.on("unhandledRejection", function(reason, p) {
  console.error("unhandledRejection: " + reason);
});

const fitbit = require("./routes/fitbit");
const user = require("./routes/user");
const vital = require("./routes/vitals");

const app = require("express")();
const bodyParser = require("body-parser");
const passport = require("passport");
const expressSession = require("express-session");

const mongoose = require("mongoose");
const localStrategy = require("passport-local");
const userSchema = require("./models/userModel");

const cred = require("./credentials.json");
const logger = require("./logger");

global.logger = logger;

mongoose.connect(
  cred.mongoURL,
  {
    useNewUrlParser: true
  }
);

mongoose.connection.on("connected", () => {
  logger.verbose("Connected to Mongoose");
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

let port = process.env.PORT || 8080;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  expressSession({
    secret: "BREATHE RIGHT",
    // store: new RedisStore({
    //     host: 'localhost',
    //     port: 6379
    // }),
    cookie: {
      maxAge: 60000
    },
    resave: false,
    saveUninitialized: true
  })
);

app.get('/',(req,res)=>{
  res.send("<h1>Ak, Nova And Nagwa's super awesome senior project.</h1>")
})

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  // res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/fitbit", fitbit);

app.use("/user", user);

app.use("/vitals", vital);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  if (req.accepts("html")) {
    res.sendStatus(404);
    return;
  }
  if (req.accepts("json")) {
    res.send({
      error: "Not found"
    });
    return;
  }
  res.type("txt").send("Not found");
  next();
});

// app.use(function (err, req, res, next) {
//     res.status(err.status || 500);
//     // res.render('error', {
//     //   message: err.message,
//     //   error: err
//     // });
//     res.json({
//         message: err.message,
//         error: err
//     });
//     next();
// });

app.listen(port, () => {
  logger.log("verbose", `Started listening on ${port}`);
});
