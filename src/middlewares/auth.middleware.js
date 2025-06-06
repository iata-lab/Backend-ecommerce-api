const secret = process.env.JWT_SECRET || "carambolaPerez";
const jwt = require("jsonwebtoken");
const { ForbiddenError, UnauthorizedError } = require("../errors/index.js");

exports.authenticate = async (req, res, next) => {
  console.log("Ejecutando authenticate");
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("errors.auth.missing_token");
    }

    const token = authHeader.split(" ")[1];
    console.log("Token recibido para verificar:", token);
    const decoded = jwt.verify(token, secret);

    if (!decoded.session) {
      throw new ForbiddenError("errors.auth.invalid_token_type");
    }

    req.user = {
      id: decoded.session.id,
      userName: decoded.session.userName,
      role: decoded.session.role,
      isAdmin() {
        return (
          typeof this.role === "string" && this.role.toLowerCase() === "admin"
        );
      },
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware para roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new ForbiddenError("errors.auth.insufficient_permissions", {
          details: { requiredRoles: roles },
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
