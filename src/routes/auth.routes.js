const { Router } = require("../config/dependencies");
const router = Router();

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const authenticate = require("../middlewares/auth.middleware");
const {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
} = require("../validations/auth.validation");

router.post("/signup", validate(signupSchema), authController.signUp);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken
);

module.exports = router;
