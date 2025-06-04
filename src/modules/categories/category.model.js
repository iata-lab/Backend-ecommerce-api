"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
      });
      Category.belongsTo(Category, {
        foreignKey: "parent_category",
        as: "parent",
      });
      Category.hasMany(models.Category, {
        foreignKey: "parent_category",
        as: "subcategories",
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      parent_category: {
        type: DataTypes.INTEGER,
        references: {
          model: "Categories",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );

  return Category;
};
