const { User } = require("../models/user.model");
const { bcrypt } = require("../config/dependencies");
const {
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} = require("../errors");

const { generateTokens, verifyRefreshToken } = require("../utils/jwt-utils");
const { hashToken } = require("../utils/token.utils");

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
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { credential, password } = req.body;

    const user = await User.scope({
      method: ["byCredential", credential],
    }).findOne();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError("errors.auth.invalid_credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    const hashedToken = hashToken(refreshToken);

    await user.update({ refreshToken: hashedToken, lastLogin: new Date() });

    res.json({
      success: true,
      message: req.__("auth.login_success"),
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new UnauthorizedError("errors.auth.invalid_session");
    }

    await user.update({ refreshToken: null });

    res.json({
      success: true,
      message: req.__("auth.logout_success"),
    });
  } catch (error) {
    next(error);
  }

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
        token: newAccessToken,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        error = new UnauthorizedError("errors.auth.expired_session");
      }
      next(error);
    }
  };
};
