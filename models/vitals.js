const mongoose = require('mongoose');

var vitalSchema = new mongoose.Schema({
    pID: String,
    type: String,
    value: {},
    time: Date
});

module.exports = mongoose.model('Vital', vitalSchema);