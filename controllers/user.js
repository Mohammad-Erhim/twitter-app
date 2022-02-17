const { validationResult } = require("express-validator");

const User = require("../models/user");
const { validateImageHelper } = require("../util/validateFile");

exports.user = async (req, res, next) => {
  const userRef = req.params.userRef;
  try {
    const user = await User.findById(userRef);
    
     res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
exports.me = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};
exports.updateMe = async (req, res, next) => {
  const cover = req.body.cover;
  const avatar = req.body.avatar;
  const errors = validationResult(req);
  const user=req.user;

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }
    validateImageHelper(cover,'cover');
    validateImageHelper(avatar,'avatar');
    user.cover=cover;
    user.avatar=avatar;
    
   await user.save();
   res.status(200).json({ message: "User updated", user });
    
  } catch (err) {
    console.log(err);
    next(err);
  }
};

