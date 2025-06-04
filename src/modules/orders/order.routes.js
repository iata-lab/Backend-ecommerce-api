const { express } = require("../config/dependencies");
const router = express.Router();

const controller = require("../controllers/order.controller");
const {
  authenticate,
  authorize,
} = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");

// Admin
router.get(
  "/orders",
  authenticate,
  requireAdmin,
  validate(orderIdParamSchema, "params"),
  controller.getAllOrders
);
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
