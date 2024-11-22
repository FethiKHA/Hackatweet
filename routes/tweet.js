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
                created: new Date(),
            });
            newTweet.save();
            res.json({ result: true, newTweet });
        } else {
            res.json({ result: false, error: "Pas de bras, pas de chocolat" });
        }
    });
});


router.delete("/", (req, res) => {
    User.findOne({ token: req.body.token }).then((user) => {
        Tweet.deleteOne({ _id: req.body.tweetId, user: user._id }).then((data) => {
            if (data) {
                res.json({ result: true, message: "tweet deleted" });
            } else {
                res.json({ result: false, error: "tweet still available" });
            }
        })
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

console.log()
router.get("/allTweet", (req, res) => {


    Tweet.find().populate("user")

        .then(tweets => {

           const tweetTime = tweets.map(tweet => ({

               ...tweet,

               elapsedTime: getElapsedTime(new Date(tweet.created).getTime())
           }));

            res.json({ result: true, tweets: tweets});
            console.log(tweets)
        })

        .catch(() => {
            res.json({ result: false, error: "Pas de Tweet Marine" });
        });
});

function getElapsedTime(createdTimestamp) {

    const secondsAgo = Math.floor((Date.now() - createdTimestamp) / 1000);


if (secondsAgo < 30) return "Few seconds ago";

if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} - m`;

if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} - h`;

return `${Math.floor(secondsAgo / 86400)} - d `




    // // switch (secondsAgo) {


    //     case (secondsAgo < 30):
    //         return "Few seconds ago";

    //     case (secondsAgo < 3600):
    //         return `${Math.floor(secondsAgo / 60)} - m `;


    //     case (secondsAgo < 86400):
    //         return `${Math.floor(secondsAgo / 3600)} - h `

    //     default:

    //         

    // // }

   


    return `${Math.floor(secondsAgo / 86400)} - d`;
}

router.post("/hashtag", (req, res) => {
    const hashtag = req.body.hashtag;

    if (!hashtag) {
        res.json({ result: false, error: "you're fucking BICHE!!" });
        return;
    }

    const regex = new RegExp(`#${hashtag}`, "i");

    Tweet.find({ content: { $regex: regex } }).then(data => {
        if (data.length > 0) {
            res.json({ result: true, tweet: data });
        } else {
            res.json({ result: false, error: "You're fucking BICHE" });
        }
    });
});


module.exports = router;

