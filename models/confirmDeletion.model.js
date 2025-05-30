module.exports = (sequelize, DataTypes) => {
  const ConfirmDeletion = sequelize.define(
    "ConfirmDeletion",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      /*ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },*/
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["expiresAt"],
        },
      ],
    }
  );

  ConfirmDeletion.associate = (models) => {
    ConfirmDeletion.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return ConfirmDeletion;
};
