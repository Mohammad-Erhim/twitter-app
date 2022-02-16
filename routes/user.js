const express = require("express");
const { body } = require("express-validator");
 
const userController = require("../controllers/user");
 
const isAuth = require("../middleware/is-auth");
const router = express.Router();
 
router.get("/users/:userRef", isAuth, userController.user);

router.get("/me", isAuth, userController.me);

router.patch("/me", isAuth, [
    body("cover", "Please enter a cover between 1 to 500 characters.")
      .isLength({ min: 1, max: 500 })
      .trim(),
      body("avatar", "Please enter a avatar between 1 to 500 characters.")
      .isLength({ min: 1, max: 500 })
      .trim(),
     
  ], userController.updateMe);



module.exports = router;
