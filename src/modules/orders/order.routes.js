const express = require("express");
console.log("typeof express:", typeof express);
console.log("express keys:", Object.keys(express));
const router = express.Router();

const controller = require("./order.controller");
console.log("controller keys:", Object.keys(controller));
console.log("controller.getAllOrders:", controller.getAllOrders);
console.log("controller =", controller);

const validate = require("../../middlewares/validate.middleware");
const { orderIdParamSchema } = require("./order.validation");

const { authenticate } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");
console.log("typeof authenticate:", typeof authenticate);
console.log("typeof requireAdmin:", typeof requireAdmin);
console.log("typeof getAllOrders:", typeof controller.getAllOrders);

// Admin
router.get("/orders", authenticate, requireAdmin, controller.getAllOrders);
router.get("/order/:id", authenticate, requireAdmin, controller.getOrderById);

// Usuario loggeado
router.get("/profile/orders", authenticate, controller.getAllUserOrders);
router.get(
  "/profile/order/:id",
  authenticate,
  validate(orderIdParamSchema, "params"),
  controller.getUserOrderById
);

module.exports = router;
