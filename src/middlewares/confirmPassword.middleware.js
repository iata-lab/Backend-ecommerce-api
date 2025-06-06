const { sequelize } = require("../config/db.config");
const User = sequelize.models.User;
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const requirePasswordConfirmation = async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new BadRequestError("errors.auth.confirmation_required"));
  }

  try {
    const user = await User.scope("withPassword").findByPk(req.user.id);
    if (!user) {
      console.log("User no encontrado en confirmPassword middleware");
      throw new NotFoundError("errors.user.not_found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password incorrecta");
      throw new UnauthorizedError("errors.auth.invalid_password");
    }

    req.passwordConfirmed = true;
    console.log("Password confirmada correctamente");
    next();
  } catch (error) {
    console.error("Error en confirmPassword middleware:", error);
    next(error);
  }
};

module.exports = requirePasswordConfirmation;
