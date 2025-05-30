const { db } = require("../models");
const sequelize = db.sequelize;
const { User, logger, bcrypt } = require("../config/dependencies");
const { ForbiddenError, NotFoundError, BadRequestError } = require("../errors");
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
    const user = await user.findByPK(req.user.id, {
      attributes: SAFE_USER_ATTRIBUTES,
    });

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil del usuario
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
      throw new BadRequestError(
        "No se proporcionaron campos válidos para actualizar"
      );
    }

    const user = await User.findByPk(req.user.id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
      updates.lastPasswordChange = new Date();
    }
    const updatedUser = await user.update(updates, {
      transaction,
      fields: ALLOWED_UPDATES,
      validate: true,
    });

    await transaction.commit();

    res.json(updatedUser);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.deleteProfile = [
  // Middlewares
  authMiddleware.authenticate,
  confirmDeletionMiddleware.requirePasswordConfirmation,

  // Controlador
  async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      // Verificar que la confirmación pasó
      if (!req.passwordConfirmed) {
        throw new ForbiddenError("Confirmación requerida");
      }

      const user = await User.findByPk(req.User.userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!user) {
        throw new NotFoundError("Usuario no encontrado");
      }

      await user.destroy({ transaction });
      await invalidateUserTokens(user.id, transaction);

      await transaction.commit();

      res.json({
        success: true,
        message: "Cuenta eliminada correctamente",
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  },
];

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenError("Acceso restringido a administradores");
    }

    const users = await User.findAll({
      attributes: SAFE_USER_ATTRIBUTES,
      order: [["createdAt", "DESC"]],
    });

    logger.info(`Listado de usuarios consultado por admin ${req.user.id}`);
    res.json(users);
  } catch (error) {
    next(error);
    res.status(500).json({ message: error.message });
  }
};

async function invalidateUserTokens(userId, transaction) {
  await RefreshToken.update(
    { isRevoked: true },
    {
      where: { userId },
      transaction,
    }
  );
}
