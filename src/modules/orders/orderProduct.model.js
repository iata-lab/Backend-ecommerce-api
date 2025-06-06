const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  const OrderProduct = sequelize.define(
    "OrderProduct",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "errors.validation.quantity_min",
          },
          notNull: { msg: "errors.validation.required" },
        },
      },
      unitPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "errors.validation.price_min",
          },
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        { fields: ["order_id"] },
        { fields: ["product_id"] },
        {
          unique: true,
          fields: ["order_id", "product_id"],
        },
      ],
      hooks: {
        beforeSave: async (orderProduct) => {
          if (!orderProduct.unitPrice) {
            const product = await sequelize.models.Product.findByPk(
              orderProduct.product_id
            );
            if (!product || !product.price) {
              throw new Error("errors.order.missing_product_price");
            }
            orderProduct.unitPrice = product.price;
          }
        },
      },
    }
  );

  OrderProduct.associate = (models) => {
    OrderProduct.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
      onDelete: "CASCADE",
    });

    OrderProduct.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
      onDelete: "RESTRICT",
    });
  };

  OrderProduct.prototype.getSubtotal = function () {
    return (this.quantity * this.unitPrice).toFixed(2);
  };

  return OrderProduct;
};
