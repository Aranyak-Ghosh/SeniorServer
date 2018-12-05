const mongoose = require('mongoose');

var severitySchema = new mongoose.Schema({
    pID: String,
    type: String,
    severity: String,
    time: Date
});

module.exports = mongoose.model('Severity', severitySchema);