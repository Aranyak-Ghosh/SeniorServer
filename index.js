process.on("uncaughtException", function (error) {
    if (error && error.stack) {
        console.error("uncaughtException: " + error.stack);
    } else {
        console.error("uncaughtException: " + error);
    }
});

process.on("unhandledRejection", function (reason, p) {
    console.error("unhandledRejection: " + reason);
});

const fitbit = require('./routes/fitbit')
const app = require("express")();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    next();
})

app.use('/fitbit', fitbit)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    //   message: err.message,
    //   error: err
    // });
    res.json({
        message: err.message,
        error: err
    });
    next();
});

app.listen(8080, () => {
    console.log("Started listening on 8080");
})