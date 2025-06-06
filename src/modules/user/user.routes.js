const express = require("express");
const router = express.Router();
const { sequelize } = require("../../config/db.config");
const { User } = sequelize.models;
const controller = require("./user.controller");
console.log("controller.getProfile:", controller.getProfile);
console.log("typeof controller.getProfile:", typeof controller.getProfile);
console.log("getProfile type:", typeof controller.getProfile); // debería imprimir: function

const { authenticate } = require("../../middlewares/auth.middleware");
const confirmPassword = require("../../middlewares/confirmPassword.middleware");
const validate = require("../../middlewares/validate.middleware");
const { updateUserSchema } = require("./user.validation");
const { requireAdmin } = require("../../middlewares/role.middleware");

console.log("controller.getProfile:", controller.getProfile);
console.log("is function:", typeof controller.getProfile === "function");
console.dir(controller.getProfile, { depth: null });

// Solo users autenticados
router.get("/profile", authenticate, controller.getProfile);
router.patch(
  "/profile",
  authenticate,
  validate(updateUserSchema),
  controller.updateProfile
);
router.delete(
  "/profile",
  authenticate,
  confirmPassword,
  controller.deleteProfile
);

// Solo adminis
//router.get("/users", authenticate, requireAdmin, controller.getAllUsers);
router.get("/users", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.scope("safeAttributes").findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error en controlador getAllUsers:", error);
    next(error);
  }
});

module.exports = router;
