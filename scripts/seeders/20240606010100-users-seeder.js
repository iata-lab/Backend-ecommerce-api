"use strict";
const { hashPassword } = require("../../src/utils/passwordUtils");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        userName: "jon_snow",
        email: "jon@example.com",
        password: hashPassword("1234567!Q"),
        role: "user",
        refreshToken: null,
        lastPasswordChange: null,
        emailVerified: false,
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userName: "arya_stark",
        email: "arya@example.com",
        password: hashPassword("!Weeabc456"),
        role: "user",
        refreshToken: null,
        lastPasswordChange: null,
        emailVerified: false,
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userName: "sansa_stark",
        email: "sansa@example.com",
        password: hashPassword("T/fwefwef"),
        role: "user",
        refreshToken: null,
        lastPasswordChange: null,
        emailVerified: false,
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userName: "admin_user",
        email: "admin@example.com",
        password: hashPassword("T)Yhduuy3"),
        role: "admin",
        refreshToken: null,
        lastPasswordChange: null,
        emailVerified: false,
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userName: "brandon_stark",
        email: "brandon@example.com",
        password: hashPassword("p?tteg37"),
        role: "user",
        refreshToken: null,
        lastPasswordChange: null,
        emailVerified: false,
        isActive: true,
        loginAttempts: 0,
        lockedUntil: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
