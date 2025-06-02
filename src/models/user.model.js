const {
  validatePasswordStrength,
  hashPassword,
} = require("../utils/passwordUtils");
const { ValidationError } = require("../errors/index");
const { Op } = require("sequelize");
const { bcrypt } = require("../config/dependencies");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "errors.user.email_exists",
        },
        validate: {
          isEmail: { msg: "errors.validation.email" },
          notEmpty: { msg: "errors.validation.required" },
          notNull: { msg: "errors.validation.required" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          try {
            validatePasswordStrength(value);
            this.setDataValue("password", hashPassword(value));
          } catch (error) {
            throw new ValidationError(
              error.translationKey || "errors.validation.password",
              {
                details: error.details || { value },
              }
            );
          }
        },
        validate: {
          len: {
            args: [8, 255],
            msg: "errors.validation.password_length",
          },
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "errors.user.username_exists",
        },
        validate: {
          len: {
            args: [3, 50],
            msg: "errors.validation.username_length",
          },
          is: {
            args: /^[a-zA-Z0-9_]+$/,
            msg: "errors.validation.username_format",
          },
          notNull: { msg: "errors.validation.required" },
        },
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      loginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
      },
      lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      defaultScope: {
        attributes: {
          exclude: ["password", "refreshToken", "loginAttempts", "lockedUntil"],
        },
      },
      hooks: {
        beforeCreate: (user) => {
          user.email = user.email.toLowerCase();
        },
      },
      scopes: {
        byCredential(credential) {
          return {
            where: {
              [Op.or]: [{ userName: credential }, { email: credential }],
              isActive: true,
            },
          };
        },
        withSensitiveData: {
          attributes: {
            include: ["refreshToken", "loginAttempts", "lockedUntil"],
          },
        },
        withPassword: {
          attributes: { include: ["password"] },
        },
        active: {
          where: {
            isActive: true,
          },
        },
      },
      indexes: [
        { unique: true, fields: ["userName"] },
        { unique: true, fields: ["email"] },
        { fields: ["isActive"] },
        { fields: ["role"] },
      ],
    }
  );

  // Métodos de instancia
  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.incrementLoginAttempts = async function () {
    const attempts = this.loginAttempts + 1;
    let lockedUntil = null;

    if (attempts >= 5) {
      lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.update({
      loginAttempts: attempts,
      lockedUntil,
    });
  };

  User.prototype.resetLoginAttempts = async function () {
    await this.update({ loginAttempts: 0, lockedUntil: null });
  };

  User.prototype.updateLastLogin = async function () {
    await this.update({ lastLogin: new Date() });
  };

  User.prototype.isAdmin = function () {
    return this.role === "admin";
  };

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: { name: "userId", allowNull: false },
    });
    User.hasMany(models.OrderProduct, {
      foreignKey: "userId",
    });
    User.hasMany(models.RefreshToken, {
      foreignKey: "userId",
    });
  };

  return User;
};
