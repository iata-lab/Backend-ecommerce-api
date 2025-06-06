"use strict";
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "errors.validation.required" },
          len: {
            args: [1, 100],
            msg: "errors.validation.name_length",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "errors.validation.required" },
          len: {
            args: [1, 500],
            msg: "errors.validation.description_length",
          },
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "errors.validation.price_min",
          },
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsToMany(models.Order, {
      through: models.OrderProduct,
      foreignKey: "product_id",
    });
    Product.belongsToMany(models.Category, {
      through: models.ProductCategory,
    });
  };

  return Product;
};
