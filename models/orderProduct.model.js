module.exports = (sequelize, DataTypes) => {
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
      /*userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },*/

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "La cantidad mínima es 1",
          },
        },
      },
      unitPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          fields: ["orderId"],
        },
        {
          fields: ["productId"],
        },
        {
          fields: ["userId"],
        },
        {
          unique: true,
          fields: ["orderId", "productId"],
        },
      ],
      hooks: {
        beforeSave: async (orderProduct) => {
          if (!orderProduct.unitPrice && orderProduct.Product) {
            const product = await sequelize.models.Product.findByPk(
              orderProduct.productId
            );
          }

          if (product) {
            orderProduct.unitPrice = product.price;
          }
        },
      },
      getterMethods: {
        subtotal() {
          return (this.quantity * this.unitPrice).toFixed(2);
        },
      },
    }
  );

  OrderProduct.associate = (models) => {
    OrderProduct.belongsTo(models.Order),
      {
        foreignKey: {
          name: "id",
          allowNull: false,
        },
        onDelete: "CASCADE",
      };

    OrderProduct.belongsTo(models.Product, {
      foreignKey: {
        name: "id",
        allowNull: false,
      },
      onDelete: "RESTRICT",
    });
    /*OrderProduct.belongsTo(models.User, {
      foreignKey: {
        name: "id",
        allowNull: false,
      },
    });*/
  };

  return OrderProduct;
};
