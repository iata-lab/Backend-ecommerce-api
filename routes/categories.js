const express = require("express");
const router = express.Router();

const CatController = require("../controllers/CategoryController");

router.get("/", CatController.getCategoriesAndProducts); // Query param: name
router.get("/:id", CatController.getCategoryById);
router.post("/", CatController.createCategory);
router.put("/:id", CatController.updateCategory);
router.delete("/:id", CatController.deleteCategory);

module.exports = router;
