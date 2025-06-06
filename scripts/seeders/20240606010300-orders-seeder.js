"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM Users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const findUser = (email) => users.find((u) => u.email === email)?.id;

    await queryInterface.bulkInsert(
      "Orders",
      [
        {
          userId: findUser("jon@example.com"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: findUser("arya@example.com"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: findUser("sansa@example.com"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: findUser("jon@example.com"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: findUser("admin@example.com"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
