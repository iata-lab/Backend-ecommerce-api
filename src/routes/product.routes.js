const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/product.validation");

const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
} = require("../controllers/product.controller");

const { authenticate } = require("../middlewares/auth.middleware");

// Rutas públicas
router.get("/products", getAll);
router.get("/products/:id", getById);

// Rutas protegidas
router.post("/products", authenticate, validate(createProductSchema), create);
router.put(
  "/products/:id",
  authenticate,
  validate(updateProductSchema),
  updateById
);
router.delete("/products/:id", authenticate, deleteById);

module.exports = router;
