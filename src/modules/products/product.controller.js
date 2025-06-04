const {
  Sequelize: { Op },
  sequelize,
} = require("sequelize");

const { Product } = require("../products/product.model");
const { Category } = require("../categories/category.model");

const { BadRequestError, NotFoundError } = require("../../errors");

exports.getAll = async (req, res, next) => {
  try {
    let { sort = "ASC", name, price, minPrice, maxPrice } = req.query;

    if (
      (sort !== "ASC" && sort !== "DESC") ||
      (price !== undefined && isNaN(+price)) ||
      (minPrice !== undefined && isNaN(+minPrice)) ||
      (maxPrice !== undefined && isNaN(+maxPrice))
    ) {
      throw new BadRequestError("errors.product.invalid_parameters", {
        details: { invalidParams: req.query },
      });
    }

    const priceFilter = {
      ...(minPrice ? { [Op.gte]: +minPrice } : {}),
      ...(maxPrice ? { [Op.lte]: +maxPrice } : {}),
      ...(price ? { [Op.eq]: +price } : {}),
    };

    const nameFilter = name ? { [Op.like]: `%${name}%` } : {};

    const products = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        ...(price || minPrice || maxPrice ? { price: priceFilter } : {}),
        ...(name ? { name: nameFilter } : {}),
      },
      include: [
        {
          model: Category,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          through: { attributes: [] },
        },
      ],
      order: [["price", sort]],
    });

    res.json({
      success: true,
      message: req.__("product.listed"),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = +req.params.id;
    if (isNaN(id)) {
      throw new BadRequestError("errors.product.invalid_id");
    }

    const product = await Product.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Category,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          through: { attributes: [] },
        },
      ],
    });
    if (!product) {
      throw new NotFoundError("errors.product.not_found", {
        details: { productId: id },
      });
    }

    res.json({
      success: true,
      message: req.__("product.found"),
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  const { categories, ...productData } = req.body;
  const transaction = await sequelize.transaction();

  try {
    productData.userId = req.user.id;
    const product = await Product.create(productData, { transaction });

    if (categories && Array.isArray(categories)) {
      await product.setCategories(categories, { transaction });
    }
    const createdProduct = await Product.findByPk(product.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Category,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          through: { attributes: [] },
        },
      ],
      transaction,
    });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: req.__("product.created"),
      data: createdProduct,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.updateById = async (req, res, next) => {
  const { product } = req;
  const { categories, ...updateData } = req.body;

  const transaction = await sequelize.transaction();

  try {
    await product.update(updateData, { transaction });

    if (categories && Array.isArray(categories)) {
      await product.setCategories(categories, { transaction });
    }

    await transaction.commit();

    res.json({
      success: true,
      message: req.__("product.updated"),
      data: product, // opcional: devolver producto actualizado
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.deleteById = async (req, res, next) => {
  const { product } = req;
  const transaction = await sequelize.transaction();

  try {
    if (isNaN(product.id)) {
      throw new BadRequestError("errors.product.invalid_id");
    }

    await product.setCategories([], { transaction });

    await product.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: req.__("product.deleted"),
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
