const { Sequelize } = require("sequelize");
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } =
  process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT || "mysql",
  logging: false,
  dialectOptions: {
    connectTimeout: 60000,
    ssl: false,
  },
});

const models = {
  User: require("../modules/users/user.model")(sequelize),
  Product: require("../modules/products/product.model")(sequelize),
  Order: require("../modules/orders/order.model")(sequelize),
  OrderProduct: require("../modules/orders/orderProduct.model")(sequelize),
  ProductCategory: require("../modules/products/productCategory.model")(
    sequelize
  ),
  Category: require("../modules/categories/category.model")(sequelize),
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  models,
};
