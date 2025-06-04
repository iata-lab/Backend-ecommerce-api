const { secret, jwt } = require("../config/jwt.config.js");
const { ForbiddenError, UnauthorizedError } = require("../errors/index.js");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("errors.auth.missing_token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret);

    if (!decoded.session) {
      throw new ForbiddenError("errors.auth.invalid_token_type");
    }

    req.user = {
      id: decoded.id,
      userName: decoded.userName,
      role: decoded.role,
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
