const User = require("../modules/users/user.model");
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
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw new NotFoundError("errors.user.not_found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("errors.auth.invalid_password");
    }

    req.passwordConfirmed = true;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requirePasswordConfirmation;
