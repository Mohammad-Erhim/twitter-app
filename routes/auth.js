const express = require("express");
const { body, check } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.post(
  "/signup",

  [  body(
    "name",
    "Please enter a name with only numbers and text between 6 to 15 characters."
  )
    .isLength({ min: 6, max: 15 })
    .isAlphanumeric()
    .trim(),
    body("email", "Please enter a valid email.")
      .isEmail()
      .custom(async (value, { req }) => {
        
        const exist = await User.exists({ email: value });
        if (exist) {
          return Promise.reject(
            "Email exists already, please pick a different one."
          );
        }
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text between 6 to 15 characters."
    )
      .isLength({ min: 6, max: 15 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      }),
  ],
  authController.signup
);
router.post(
  "/login",

  [
    body("email", "Please enter a valid email address.")
      .isEmail()
      .normalizeEmail(),
    body("password", "Please enter a password with only numbers and text between 6 to 15 characters.")
      .isLength({ min: 6, max: 15 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.login
);

router.post("/logout", isAuth, authController.logout);

router.post("/password/recovery",[ body("email", "Please enter a valid email address.")
.isEmail()
.normalizeEmail(),], authController.recoveryPassword);

router.post(
  "/password/set/:recoveryToken",
  [
    body(
      "password",
      "Please enter a password with only numbers and text between 6 to 15 characters."
    )
      .isLength({ min: 6, max: 15 })
      .isAlphanumeric()
      .trim(),
      body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match.");
        }
        return true;
      })
  ],

  authController.setPassword
);

module.exports = router;
