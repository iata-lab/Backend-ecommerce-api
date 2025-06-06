const { sequelize } = require("../../config/db.config");
const User = sequelize.models.User;
console.log("User keys en auth.controller:", Object.keys(User));

const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const {
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} = require("../../errors");

const { generateTokens, verifyRefreshToken } = require("../../utils/jwt-utils");
const { hashToken } = require("../../utils/token.utils");

exports.signUp = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const user = await User.create({ userName, email, password });
    const { accessToken, refreshToken } = await generateTokens(user);

    const hashedToken = hashToken(refreshToken);
    await user.update({ refreshToken: hashedToken });

    res.status(201).json({
      success: true,
      message: req.__("auth.signup_success"),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { credential, password } = req.body;

    const user = await User.scope("withPassword").findOne({
      where: {
        [Op.or]: [{ userName: credential }, { email: credential }],
        isActive: true,
      },
    });

    console.log("Usuario recuperado para login:", user?.toJSON());


    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("errors.auth.invalid_credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    const hashedToken = hashToken(refreshToken);

    await user.update({ refreshToken: hashedToken, lastLogin: new Date() });

    res.json({
      success: true,
      message: req.__("auth.login_success"),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("LOGIN ERROR: ", error);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  console.log("Entrando a logout");
  try {
    const { id } = req.user;

    console.log("User ID from token:", id);
    console.log("Model User keys:", Object.keys(User));
    console.log("Buscando usuario con ID:", id);

    const user = await User.findByPk(id);
    console.log("Resultado de findByPk:", user);

    if (!user) {
      throw new UnauthorizedError("errors.auth.invalid_session");
    }

    await User.update({ refreshToken: null }, { where: { id: req.user.id } });

    res.json({
      success: true,
      message: req.__("auth.logout_success"),
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError("errors.auth.missing_token");
    }

    const decoded = verifyRefreshToken(refreshToken);
    const hashedToken = hashToken(refreshToken);

    const user = await User.findOne({
      where: {
        id: decoded.userId,
        refreshToken: hashedToken,
      },
    });

    if (!user) {
      throw new ForbiddenError("errors.auth.invalid_session");
    }

    const { accessToken: newAccessToken } = await generateTokens(user);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error = new UnauthorizedError("errors.auth.expired_session");
    }
    next(error);
  }
};
