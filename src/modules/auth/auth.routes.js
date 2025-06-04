const express = require("express");
const router = express.Router();

const controller = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const { authenticate } = require("../../middlewares/auth.middleware");
const {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
} = require("./auth.validation");

router.post("/signup", validate(signupSchema), controller.signUp);
router.post("/login", validate(loginSchema), controller.login);
router.post("/logout", authenticate, controller.logout);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  controller.refreshToken
);

module.exports = router;
