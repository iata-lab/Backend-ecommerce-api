const { express } = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/signup", authController.signin);
router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
