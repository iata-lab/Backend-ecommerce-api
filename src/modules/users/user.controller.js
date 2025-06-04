const { sequelize } = require("../../config/db.config");
/*const RefreshToken = require("../auth/auth.controller");*/
const bcrypt = require("bcryptjs");
const { models } = require("../../config/db.config");
const { RefreshToken, User } = models;
/*const User = models.User;*/

const {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
} = require("../../errors");

const SAFE_USER_ATTRIBUTES = [
  "id",
  "userName",
  "email",
  "isActive",
  "emailVerified",
  "role",
  "createdAt",
  "updatedAt",
];

const ALLOWED_UPDATES = ["userName", "email", "password"];

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: SAFE_USER_ATTRIBUTES,
    });

    if (!user) {
      throw new NotFoundError("errors.user.not_found", {
        details: { userId: req.user.id },
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const updates = Object.keys(req.body)
      .filter((key) => ALLOWED_UPDATES.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    if (Object.keys(updates).length === 0) {
      throw new BadRequestError("errors.user.no_valid_fields", {
        details: { allowedUpdates: ALLOWED_UPDATES },
      });
    }

    const user = await User.findByPk(req.user.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      throw new NotFoundError("errors.user.not_found", {
        details: { userId: req.user.id },
      });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
      updates.lastPasswordChange = new Date();
    }

    await user.update(updates, {
      transaction,
      fields: ALLOWED_UPDATES,
      validate: true,
    });

    await transaction.commit();

    res.json({
      success: true,
      message: req.__("user.updated"),
      data: user,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    if (!req.passwordConfirmed) {
      throw new ForbiddenError("errors.auth.confirmation_required");
    }

    const user = await User.findByPk(req.user.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      throw new NotFoundError("errors.user.not_found", {
        details: { userId: req.user.id },
      });
    }

    await user.destroy({ transaction });
    await user.update({ refreshToken: null }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: req.__("user.deleted"),
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenError("errors.auth.admin_required");
    }

    const users = await User.findAll({
      attributes: SAFE_USER_ATTRIBUTES,
      order: [["createdAt", "DESC"]],
    });

    /*logger.info(`Admin ${req.user.id} accessed user list`, {
      action: "user_list_access",
      userId: req.user.id,
    });*/

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
