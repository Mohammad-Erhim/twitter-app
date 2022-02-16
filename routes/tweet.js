const express = require("express");
const { body } = require("express-validator");

const tweetController = require("../controllers/tweet");

const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.post(
  "/tweets",
  isAuth,
  [
    body("text", "Please enter a text between 1 to 500 characters.")
      .isLength({ min: 1, max: 500 })
      .trim(),
    body("images", "Please enter at most 4 images").isArray({ max: 4 }),
    body("images.*", "Path is invalid.").isLength({ min: 1, max: 500 }).trim(),
  ],
  tweetController.addTweet
);

router.get("/tweets", isAuth, tweetController.tweets);
router.get("/users/:userRef/tweets", isAuth, tweetController.userTweets);
router.get("/tweets/:tweetId", isAuth, tweetController.tweet);

router.delete("/tweets/:tweetId", isAuth, tweetController.deleteTweet);
router.patch(
  "/tweets/:tweetId",
  isAuth,
  [
    body("text", "Please enter a text between 1 to 500 characters.")
      .isLength({ min: 1, max: 500 })
      .trim(),
    body("images", "Please enter at most 4 images")
      
      .isArray({ max: 4 }),
    body("images.*").isLength({ min: 1, max: 500 }).trim(),
  ],
  tweetController.updateTweet
);

module.exports = router;
