const router = require("express").Router();
const {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
} = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate");
const confirmPassword = require("../middlewares/confirmPassword");
const validate = require("../middlewares/validate");
const { updateUserSchema } = require("../validations/user.validation");

// SOlo users autenticados
router.get("/profile", authenticate, getProfile);
router.patch(
  "/profile",
  authenticate,
  validate(updateUserSchema),
  updateProfile
);
router.delete("/profile", authenticate, confirmPassword, deleteProfile);

// Solo adminis
router.get("/users", authenticate, getAllUsers);

module.exports = router;
