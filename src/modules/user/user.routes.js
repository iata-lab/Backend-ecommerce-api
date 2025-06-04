const router = require("express").Router();
const {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
} = require("./user.controller");
const authenticate = require("../../middlewares/authenticate");
const confirmPassword = require("../../middlewares/confirmPassword");
const validate = require("../../middlewares/validate.middleware");
const { updateUserSchema } = require("./user.validation");
const { requireAdmin } = require("../../middlewares/role.middleware");

// Solo users autenticados
router.get("/profile", authenticate, getProfile);
router.patch(
  "/profile",
  authenticate,
  validate(updateUserSchema),
  updateProfile
);
router.delete("/profile", authenticate, confirmPassword, deleteProfile);

// Solo adminis
router.get("/users", authenticate, requireAdmin, getAllUsers);

module.exports = router;
