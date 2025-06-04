"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    static associate(models) {
      ProductCategory.belongsTo(models.Product, { foreignKey: "ProductId" });
      ProductCategory.belongsTo(models.Category, { foreignKey: "CategoryId" });
    }
  }
  ProductCategory.init(
    {
      ProductId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Products",
          key: "id",
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Categories",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ProductCategory",
      tableName: "product_categories",
      timestamps: false,
    }
  );
  return ProductCategory;
};
