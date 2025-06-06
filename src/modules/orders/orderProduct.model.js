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
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      productId: {
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
        { fields: ["orderId"] },
        { fields: ["productId"] },
        {
          unique: true,
          fields: ["orderId", "productId"],
        },
      ],
      hooks: {
        beforeSave: async (orderProduct) => {
          if (!orderProduct.unitPrice) {
            const product = await sequelize.models.Product.findByPk(
              orderProduct.productId
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
      foreignKey: "orderId",
      as: "order",
      onDelete: "CASCADE",
    });

    OrderProduct.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
      onDelete: "RESTRICT",
    });
  };

  OrderProduct.prototype.getSubtotal = function () {
    return (this.quantity * this.unitPrice).toFixed(2);
  };

  return OrderProduct;
};
