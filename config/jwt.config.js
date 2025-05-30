require("dotenv").config();
const { jwt } = require("../config/dependencies");

const JWT_SECRET = process.env.JWT_SECRET || "secretPorDefecto";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  generateToken: (payload) =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }),
  verifyToken: (token) => jwt.verify(token, JWT_SECRET),
};
