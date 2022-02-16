const express = require("express");

const isAuth = require("../middleware/is-auth");
const { upload } = require("../util/upload");
const router = express.Router();

router.post(
  "/images",
  isAuth,
  upload.single("image"),
  async (req, res, next) => {

    try {
      res.status(200).json({ message: "File added.", path: req.file.path });
    } catch (err) {
     err.message='Field image is not define';
     err.statusCode=400;
      next(err);
    }
  }
);

module.exports = router;
