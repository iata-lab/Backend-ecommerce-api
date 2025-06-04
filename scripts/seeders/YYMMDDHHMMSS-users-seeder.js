"use strict";
//Meter las passwords encriptadas directamente?

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          ...{
            userName: "jon_snow",
            email: "jon@example.com",
            password: "1234567!Q",
            role: "user",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ...{
            userName: "arya_stark",
            email: "arya@example.com",
            password: "!Weeabc456",
            role: "user",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ...{
            userName: "sansa_stark",
            email: "sansa@example.com",
            password: "T/fwefwef",
            role: "user",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ...{
            userName: "admin_user",
            email: "admin@example.com",
            password: "T)Yhduuy3",
            role: "admin",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ...{
            userName: "brandon_stark",
            email: "brandon@example.com",
            password: "p?tteg37",
            role: "user",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
