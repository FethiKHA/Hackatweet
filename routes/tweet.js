var express = require("express");
var router = express.Router();
require('../models/connection');
const User = require("../models/users");
const Tweet = require("../models/tweet");





router.post("/", (req, res) => {
    User.findOne({ token: req.body.token }).then((data) => {
        if (data) {
            const newTweet = new Tweet({
                content: req.body.content,
                user: data._id,
            });
            newTweet.save();
            res.json({ result: true, newTweet });
        } else {
            res.json({ result: false, error: "Pas de bras, pas de chocolat" });
        }
    });
});


router.delete("/", (req, res) => {
    Tweet.deleteOne({ content: req.body.content }).then((data) => {
        if (data) {
            res.json({ result: true, message: "tweet deleted" });
        } else {
            res.json({ result: false, error: "tweet still available" });
        }
    });
});




router.post("/like", (req, res) => {
    const { username, token, tweetId } = req.body;

    User.findOne({ username, token }).then((user) => {
        if (!user) {
            return res.json({ result: false, message: "User not autorized" });
        }

        Tweet.findById(tweetId).then((tweet) => {
            if (!tweet) {
                return res.json({ result: false, message: "pas de tweet frero" });
            }

            if (tweet.likes.includes(user._id)) {

                const updatedlikes = tweet.likes.filter(e => String(e) !== String(user._id));

                Tweet.updateOne( 
                    
                    { _id: tweetId },
                    { likes: updatedlikes }

                ).then(() => {
                    return res.json({ result: true, message: "Like supprimé" });

                   
                });
            } else {

                const updatedlikes = [...tweet.likes, user._id];
                Tweet.updateOne({ _id: tweetId }, { likes: updatedlikes })
                    .then(() => {
                        return res.json({ result: true, message: "Like ajouté" });

                    });
            }

        });

    });
});

router.get("/allTweet", (req, res) => {
    Tweet.find()
      .populate("user")
      .then((data) => {
        if (data) {
          res.json({ result: true, tweets: data });
        } else {
          res.json({ result: false, error: "Pas de Tweet Marine" });
        }
      });
  });



module.exports = router;

