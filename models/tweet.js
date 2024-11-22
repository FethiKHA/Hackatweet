const mongoose = require('mongoose');


const tweetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "users" }, 
    content: String, 
    created: Date,
    likes: [{ type: mongoose.Schema.ObjectId, ref: "users" }],
    hashtags : String
});


const Tweet = mongoose.model("tweets", tweetSchema);


module.exports = Tweet;
