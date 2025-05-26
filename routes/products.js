const express = require("express");
const router = express.Router();

const { getAll, getById, create, updateById, deleteById } = require("../controllers/ProductController");

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", updateById);
router.delete("/:id", deleteById);

module.exports = router;
