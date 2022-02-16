
 const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const mailgun = require("mailgun-js");
const BlackListToken = require("../models/blackListToken");

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

exports.signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User created.", userRef: user._id });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("Wrong Email.");
      error.statusCode = 400;
      error.data = [
        {
          value: email,
          msg: "There is no user who has this email.",
          param: "email",
          location: "body",
        },
      ];
      throw error;
    }
    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      const error = new Error("Wrong password.");
      error.statusCode = 400;
      error.data = [
        {
          value: password,
          msg: "The password does not match with the email.",
          param: "password",
          location: "body",
        },
      ];
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "100h" }
    );
    return res.status(200).json({ token: token, userRef: user._id.toString() });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader.split(" ")[1];
  try {
    const expiredToken = new BlackListToken({ token });
    await expiredToken.save();
    res
      .status(200)
      .json({ message: "Logout done.", userRef: req.user._id.toString() });
  } catch (err) {
    next(err);
  }
};

exports.recoveryPassword = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) return next(err);

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 400;
        error.data = errors.array();
        throw error;
      }
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const error = new Error("Wrong email.");
        error.statusCode = 400;
        error.data = [
          {
            value: req.body.email,
            msg: "There is no user who has this email.",
            param: "email",
            location: "body",
          },
        ];
        throw error;
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      await mg.messages().send({
        to: req.body.email,
        from: "shop@node-complete.com",
        subject: "Password reset",
        html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="${process.env.APP_URL}/update-password/${token}">link</a> to set a new password.</p>
              `,
      });
      res
        .status(200)
        .json({ message: "Recovery password link sent.", userRef: user._id });
    } catch (error) {
      next(error);
    }
  });
};

exports.setPassword = async (req, res, next) => {
  const newPassword = req.body.password;

  const recoveryToken = req.params.recoveryToken;

  let resetUser;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findOne({
      resetToken: recoveryToken,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      const error = new Error("Validation failed.");
      error.statusCode = 400;
      error.data = [
        {
          value: req.params.recoveryToken,
          msg: "There is no user who has this recovery token.",
          param: "recoveryToken",
          location: "params",
        },
      ];
      throw error;
    }
    resetUser = user;
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;

    await resetUser.save();

    res
      .status(200)
      .json({ message: "Password updated.", userRef: resetUser._id });
  } catch (err) {
    next(err);
  }
};
