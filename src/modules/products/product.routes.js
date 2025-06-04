const { express } = require("../../config/dependencies");
const router = express.Router();

const controller = require("./product.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const requireOwnershipOrAdmin = require("../../middlewares/requireOwnershipOrAdmin.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("./product.validation");

// Publicas
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// Protegidas
router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  validate(updateProductSchema),
  requireOwnershipOrAdmin,
  controller.updateById
);
router.delete(
  "/:id",
  authenticate,
  requireOwnershipOrAdmin,
  controller.deleteByid
);

module.exports = router;
