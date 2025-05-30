require("dotenv").config();

module.exports = {
  development: {
    port: process.env.DB_PORT || config.DB_PORT,
    username: process.env.DB_USER || config.DB_USER,
    password: process.env.DB_PASSWORD || config.DB_PASSWORD,
    database: process.env.DB_NAME || "auth_jwt",
    host: process.env.DB_HOST || config.DB_HOST,
    dialect: "mysql", // También puede ser 'mysql', 'sqlite', etc.
    logging: false,
  },
  // Configuraciones para otros entornos (production, test)...
};
