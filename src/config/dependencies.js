/*const path = require("path");*/
const dotenv = require("dotenv");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Sequelize, Op, DataTypes } = require("sequelize");

dotenv.config();

const configJSON = require("./config.json");
/*const logger = require("./logger");*/

const env = process.env.NODE_ENV || "development";
const config = configJSON[env];

module.exports = {
  fs: () => require("fs"),
  /* path,*/
  jwt,
  bcrypt,
  Sequelize,
  DataTypes,
  Op,
  config,
  /*logger,*/

  express: require("express"),
  morgan: require("morgan"),

  JWT_SECRET: process.env.JWT_SECRET || "carambolaPerez",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "perezolaCarambo",
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || "7d",
};
