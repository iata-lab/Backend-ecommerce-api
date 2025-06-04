const { express } = require("../../config/dependencies");
const router = express.Router();

const controller = require("./category.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { requireAdmin } = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("./category.validation");

router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);

//Admin only
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(createCategorySchema),
  controller.createCategory
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateCategorySchema),
  controller.updateCategory
);
router.delete("/:id", authenticate, requireAdmin, controller.deleteCategory);

module.exports = router;
