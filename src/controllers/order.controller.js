const { Order, OrderProduct, Product } = require("../config/dependencies");
const { NotFoundError, ForbiddenError } = require("../errors");

exports.getAllOrders = async (req, res, next) => {
  try {
    if (!req.user.isAdmin()) {
      throw new ForbiddenError("errors.auth.admin_required");
    }

    const orders = await Order.findAll();
    res.json({
      success: true,
      message: req.__("order.listed_all"),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new NotFoundError("errors.order.not_found");
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      throw new NotFoundError("errors.order.not_found", {
        details: { orderId: req.params.id },
      });
    }

    res.json({
      success: true,
      message: req.__("order.found"),
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: OrderProduct,
          attributes: ["id", "price", "quantity"],
          include: [{ model: Product, attributes: ["id", "name"] }],
        },
      ],
    });

    res.json({
      success: true,
      message: req.__("order.listed_user"),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderProduct,
          attributes: ["id", "price", "quantity"],
          include: [{ model: Product, attributes: ["id", "name"] }],
        },
      ],
    });

    if (!order) {
      throw new NotFoundError("errors.order.not_found", {
        details: { orderId: req.params.id },
      });
    }

    if (order.userId !== req.user.id) {
      throw new NotFoundError("errors.order.not_owner");
    }

    res.json({
      success: true,
      message: req.__("order.found"),
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
