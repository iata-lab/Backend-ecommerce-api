'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsToMany(models.Product,{
        through: models.ProductCategory,
//	onDelete: 'CASCADE'
      });
      Category.belongsTo(Category, {
        foreignKey: 'parent_category',
      });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    parent_category: {
      type: DataTypes.INTEGER,
      references: {
        model: "Categories",
        key: "id",
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
