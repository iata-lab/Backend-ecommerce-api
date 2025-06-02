require("dotenv").config();
const fallbackConfig = require("./config.json");

const env = process.env.NODE_ENV || "development";
const localConfig = fallbackConfig[env] || {};

module.exports = {
  [env]: {
    username: process.env.DB_USER || localConfig.username,
    password: process.env.DB_PASSWORD || localConfig.password,
    database: process.env.DB_NAME || localConfig.database,
    host: process.env.DB_HOST || localConfig.host,
    dialect: process.env.DB_DIALECT || localConfig.dialect || "mysql",
    port: process.env.DB_PORT || localConfig.port,
    logging: false,
  },
};
