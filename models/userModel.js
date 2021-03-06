const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: String,
    contactNo: String,
    gender: {
        type: String,
        enum: ['m', 'f'],
        lowercase: true,
    },
    firstName: String,
    lastName: String,
    age: Number,
    address: String
});

module.exports = mongoose.model('User', userSchema);