const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/products", require("./product.routes"));
router.use("/orders", require("./order.routes"));
router.use("/profile", require("./user.routes"));

module.exports = router;
