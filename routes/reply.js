const express = require("express");
const { body } = require("express-validator");

const replyController = require("../controllers/reply");

const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get(
  "/tweets/:tweetRef/replies",
  isAuth,
  replyController.replies
);
router.post(
  "/tweets/:tweetRef/replies",
  isAuth,
  [
    body("text", "Please enter a text between 1 to 500 characters.")
      .isLength({ min: 1, max: 500 })
      .trim(),
  ],
  replyController.addReply
);

router.delete("/replies/:replyId", isAuth, replyController.deleteReply);
router.patch(
  "/replies/:replyId",
  isAuth,
  [
    body("text", "Please enter a text between 1 to 500 characters.")
      .isLength({ min: 1, max: 500 })
      .trim(),
  ],
  replyController.updateReply
);

module.exports = router;
