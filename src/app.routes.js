const express = require("express");
const router = express.Router();

router.use("/auth", require("./modules/auth/auth.routes"));
router.use("/products", require("./modules/products/product.routes"));
router.use("/orders", require("./modules/orders/order.routes"));
router.use("/profile", require("./modules/users/user.routes"));
router.use("/categories", require("./modules/categories/category.routes"));

module.exports = router;
