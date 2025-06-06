const express = require("express");
const router = express.Router();

router.use("/auth", require("../modules/auth/auth.routes"));
router.use("/products", require("./product.routes"));
router.use("/orders", require("./order.routes"));
router.use("/users", require("../modules/user/user.routes"));
router.use("/categories", require("./categories.routes"));

module.exports = router;
