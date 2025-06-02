const { express } = require("../config/dependencies");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// Admin
router.get("/orders", authenticate, orderController.getAllOrders);
router.get("/order/:id", authenticate, orderController.getOrderById);

// Usuario loggeado
router.get("/profile/orders", authenticate, orderController.getAllUserOrders);
router.get(
  "/profile/order/:id",
  authenticate,
  orderController.getUserOrderById
);

module.exports = router;
