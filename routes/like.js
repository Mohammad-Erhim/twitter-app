const express = require("express");
const { body } = require("express-validator");

const likeController = require("../controllers/like");

const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.post(
  "/tweets/:tweetRef/likes",
  isAuth,

  likeController.addLike
);

router.delete("/tweets/:tweetRef/likes", isAuth, likeController.deleteLike);

module.exports = router;
