const {
  validatePasswordStrength,
  hashPassword,
} = require("../utils/passwordUtils");

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
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
          notNull: { message: "Username can't be null" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          validatePasswordStrength(value);
          this.setDataValue("password", hashPassword(value));
        },
        validate: {
          len: {
            args: [8, 255],
            msg: "La contraseña debe tener entre 8 y 255 caracteres",
          },
        },
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
          is: /^[a-zA-Z0-9_]+$/,
          notNull: { message: "Username can'nt be null" },
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
        validate: {
          min: 0,
        },
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
        beforeCreate: (User) => {
          User.email = User.email.toLowerCase();
        },
        beforeUpdate: async (User) => {
          if (User.changed("password")) {
            User.password = await this.prototype.comparePassword.hash(
              User.password,
              10
            );
          }
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
            emailVerified: true,
          },
        },
      },
      indexes: [
        {
          unique: true,
          fields: ["userName"],
        },
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["role"],
        },
      ],
    }
  );

  // Método para comparar contraseñas
  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.generateRefreshToken = function () {
    const token = require("crypto").randomBytes(64).toString("hex");
    this.refreshToken = token;
    return token;
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
    await this.update({
      loginAttempts: 0,
      lockedUntil: null,
    });
  };

  User.prototype.updateLastLogin = async function () {
    await this.update({
      lastLogin: new Date(),
    });
  };
  
  User.prototype.isAdmin = (models) => {
    return this.role === "admin";
  };

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
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
