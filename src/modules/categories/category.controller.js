const { Category } = require("../../config/db.config").models;
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
} = require("../../errors");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: {
        model: Category,
        as: "subcategories",
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: {
        model: Category,
        as: "subcategories",
      },
    });

    if (!category) {
      throw new NotFoundError("errors.category.not_found", {
        details: { id },
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, parent_category } = req.body;

    const exists = await Category.findOne({ where: { name } });
    if (exists) {
      throw new ConflictError("errors.category.name_exists");
    }

    const category = await Category.create({ name, parent_category });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, parent_category } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      throw new NotFoundError("errors.category.not_found", {
        details: { id },
      });
    }

    if (name) category.name = name;
    if (parent_category !== undefined)
      category.parent_category = parent_category;

    await category.save();

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      throw new NotFoundError("errors.category.not_found", {
        details: { id },
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: req.__("category.deleted"),
    });
  } catch (error) {
    next(error);
  }
};
