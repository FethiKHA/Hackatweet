var express = require("express");
var router = express.Router();
require('../models/connection');
const User = require("../models/users");
const Tweet = require("../models/tweet");
const { checkBody } = require("../modules/checkBody")




router.post("/", (req, res) => {
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      const newTweet = new Tweet ({
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
        res.json({ result: false, error: "tweet not deleted" });
      }
    });
  });

module.exports = router;

