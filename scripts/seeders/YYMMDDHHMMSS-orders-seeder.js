'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Orders', [
      {
        ...{'userId': 1},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'userId': 2},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'userId': 3},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'userId': 1},
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...{'userId': 4},
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
