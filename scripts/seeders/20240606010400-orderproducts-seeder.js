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
        order_id: orders[0].id,
        product_id: findProduct("Espada de Jon Nieve"),
        quantity: 2,
        unitPrice: 59.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        order_id: orders[1].id,
        product_id: findProduct("Funko Pop! Arya Stark"),
        quantity: 1,
        unitPrice: 14.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        order_id: orders[2].id,
        product_id: findProduct("Cuaderno de Winterfell"),
        quantity: 3,
        unitPrice: 6.95,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        order_id: orders[3].id,
        product_id: findProduct("Espada de Jon Nieve"),
        quantity: 1,
        unitPrice: 59.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        order_id: orders[4].id,
        product_id: findProduct("Funko Pop! Arya Stark"),
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
