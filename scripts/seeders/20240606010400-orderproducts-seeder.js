"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const orders = await queryInterface.sequelize.query(
      `SELECT id FROM orders ORDER BY id ASC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const products = await queryInterface.sequelize.query(
      `SELECT id, name FROM products;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const findProduct = (name) => {
      const found = products.find((p) => p.name === name);
      if (!found) {
        throw new Error(`Producto no encontrado: "${name}"`);
      }
      return found.id;
    };

    await queryInterface.bulkInsert("order_products", [
      {
        orderId: orders[0].id,
        productId: findProduct("Espada de Jon Nieve"),
        quantity: 2,
        unitPrice: 59.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: orders[1].id,
        productId: findProduct("Funko Pop! Arya Stark"),
        quantity: 1,
        unitPrice: 14.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: orders[2].id,
        productId: findProduct("Cuaderno de Winterfell"),
        quantity: 3,
        unitPrice: 6.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: orders[3].id,
        productId: findProduct("Espada de Jon Nieve"),
        quantity: 1,
        unitPrice: 59.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: orders[4].id,
        productId: findProduct("Funko Pop! Arya Stark"),
        quantity: 2,
        unitPrice: 14.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("order_products", null, {});
  },
};
