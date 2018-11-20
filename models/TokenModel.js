const mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    token: String,
    username: String,
    fitbitToken: String,
    fitbitRefreshToken: String
});

module.exports = mongoose.model('Token', tokenSchema);