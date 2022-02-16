const jwt = require("jsonwebtoken");
const BlackListToken = require("../models/blackListToken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new Error("Unauthorized.");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;

    decodedToken = jwt.verify(token, "somesupersecretsecret");

    const expiredToken = await BlackListToken.findOne({ token: token });

    if (!decodedToken || expiredToken) {
      const error = new Error("Unauthorized.");
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      const error = new Error("Unauthorized.");
      error.statusCode = 401;
      throw error;
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      err.statusCode = 401;
    }
    next(err);
  }
};
