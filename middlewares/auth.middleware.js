const jwt = require("jsonwebtoken");
const { secret, jwt } = require("../config/jwt.config.js");
const { ForbiddenError, UnauthorizedError } = require("../errors");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Autenticación requerida");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret);

    if (!decoded.session) {
      throw new ForbiddenError("Token inválido");
    }

    req.user = {
      userId: decoded.userId,
      userName: decoded.userName,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para roles
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No autorizado" });
    }
    next();
  };
};
