const mongoose = require('mongoose');
const uid2 = require('uid2');


const userSchema = mongoose.Schema({
    firstname: String,
    username: String,
    password: String,
    token: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;
