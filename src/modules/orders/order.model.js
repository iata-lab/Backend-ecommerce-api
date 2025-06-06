const { DataTypes, Model } = require("sequelize");
const { ValidationError } = require("../../errors");

module.exports = (sequelize) => {
  const statusEnum = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  const statusTransitions = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "refunded"],
    delivered: ["refunded"],
    cancelled: [],
    refunded: [],
  };

  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      status: {
        type: DataTypes.ENUM(...statusEnum),
        defaultValue: "pending",
        allowNull: false,
        validate: {
          isValidTransition(value) {
            const previous = this.previous("status");
            if (
              this.changed("status") &&
              !statusTransitions[previous]?.includes(value)
            ) {
              throw new ValidationError("errors.order.invalid_transition", {
                details: { from: previous, to: value },
              });
            }
          },
        },
      },
      shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "errors.validation.required" },
        },
      },
      billingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "errors.validation.required" },
        },
      },
      trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: false,
      indexes: [
        { fields: ["userId"] },
        { fields: ["status"] },
        { fields: ["createdAt"] },
      ],
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "RESTRICT",
    });
    Order.hasMany(models.OrderProduct, {
      foreignKey: "orderId",
      as: "items",
    });
    Order.belongsToMany(models.Product, {
      through: models.OrderProduct,
      as: "products",
    });
  };

  Order.prototype.calculateTotal = async function () {
    const items = await this.getItems({
      attributes: [[sequelize.literal("quantity * unitPrice"), "itemTotal"]],
      raw: true,
    });

    return items
      .reduce((total, item) => total + parseFloat(item.itemTotal), 0)
      .toFixed(2);
  };

  return Order;
};
