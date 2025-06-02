require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "clavePorDefecto",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "otraClave",
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN || "7d",
};
