'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('OrderProducts', [
      {
        ...{'orderId': 1, 'productId': 1},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'orderId': 1, 'productId': 2},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'orderId': 2, 'productId': 3},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'orderId': 3, 'productId': 4},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'orderId': 4, 'productId': 1},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'orderId': 5, 'productId': 5},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OrderProducts', null, {});
  }
};
