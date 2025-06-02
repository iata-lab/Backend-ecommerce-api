const { Product, Sequelize } = require("../models");
const { Op } = Sequelize;
const { BadRequestError, NotFoundError } = require("../errors");

const ProductController = {
  getAll: async (req, res, next) => {
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
  },

  getById: async (req, res, next) => {
    try {
      const id = +req.params.id;
      if (isNaN(id)) {
        throw new BadRequestError("errors.product.invalid_id");
      }

      const product = await Product.findByPk(id);
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
  },

  create: async (req, res, next) => {
    try {
      const product = await Product.create(req.body);

      res.status(201).json({
        success: true,
        message: req.__("product.created"),
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  updateById: async (req, res, next) => {
    try {
      const id = +req.params.id;
      if (isNaN(id)) {
        throw new BadRequestError("errors.product.invalid_id");
      }

      const [affectedCount] = await Product.update(req.body, { where: { id } });

      if (affectedCount === 0) {
        throw new NotFoundError("errors.product.not_found", {
          details: { productId: id },
        });
      }

      res.json({
        success: true,
        message: req.__("product.updated"),
      });
    } catch (error) {
      next(error);
    }
  },

  deleteById: async (req, res, next) => {
    try {
      const id = +req.params.id;
      if (isNaN(id)) {
        throw new BadRequestError("errors.product.invalid_id");
      }

      const affectedCount = await Product.destroy({ where: { id } });

      if (affectedCount === 0) {
        throw new NotFoundError("errors.product.not_found", {
          details: { productId: id },
        });
      }

      res.json({
        success: true,
        message: req.__("product.deleted"),
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = ProductController;
