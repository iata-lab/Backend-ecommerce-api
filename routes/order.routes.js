const { express } = require("../config/dependencies");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/orders", authenticate, orders.controller.getOrders);
router.get("/order/:id", authenticate, orders.controller.getOrder);

router.get("/profile/order", authenticate, orders.controller.getOrders);
router.get("/profile/order/:id", authenticate, orders.controller.getOrder);

module.exports = router;
