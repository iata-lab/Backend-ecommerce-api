const { Product } = require("../config/models");
const { NotFoundError, ForbiddenError } = require("../errors");

module.exports = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      throw new NotFoundError("errors.http.not_found");
    }

    const isOwner = product.userId === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError("errors.auth.forbidden");
    }

    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};
