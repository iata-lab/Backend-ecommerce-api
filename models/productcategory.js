'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProductCategory.belongsTo(models.Product, { foreignKey: 'ProductId' });
      ProductCategory.belongsTo(models.Category, { foreignKey: 'CategoryId' });
    }
  }
  ProductCategory.init({
    ProductId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: "Products",
        key: "id",
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: "Categories",
        key: "id",
      }
    }
  }, {
    sequelize,
    modelName: 'ProductCategory',
  });
  return ProductCategory;
};
