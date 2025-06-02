const { jwt } = require("../config/dependencies");
const { User } = require("../models/user.model");
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_SECRET,
  REFRESH_EXPIRES_IN,
} = require("../config/jwt.config");
const { InternalServerError, UnauthorizedError } = require("../errors/index");

async function generateTokens(user) {
  const payload = {
    userId: user.id,
    userName: user.userName,
    role: user.role,
  };

  const accessToken = jwt.sign({ session: payload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  try {
    await User.update({ refreshToken }, { where: { id: user.id } });
  } catch (err) {
    throw new InternalServerError("errors.token.invalidation_failed", {
      details: err,
    });
  }

  return { accessToken, refreshToken };
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new UnauthorizedError("errors.auth.invalid_token");
  }
}

function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch {
    throw new UnauthorizedError("errors.auth.invalid_token");
  }
}

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
};
