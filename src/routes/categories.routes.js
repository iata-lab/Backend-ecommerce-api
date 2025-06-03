const express = require("express");
const router = express.Router();

const CatController = require("../controllers/categories.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/", CatController.getCategoriesAndProducts); // Query param: name
router.get("/:id", CatController.getCategoryById);
router.post("/", authenticate, CatController.createCategory);
router.put("/:id", authenticate, CatController.updateCategory);
router.delete("/:id", authenticate, CatController.deleteCategory);

module.exports = router;
