const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../errors");

exports.requireDeletionConfirmation = async (req, /*res,*/ next) => {
  try {
    const { confirmationToken } = req.body;

    const decoded = jwt.verify(
      confirmationToken,
      process.env.JWT_CONFIRM_SECRET
    );

    if (
      decoded.purpose !== "account_deletion" ||
      decoded.userId !== req.user.userId
    ) {
      throw new UnauthorizedError("Token de confirmación inválido");
    }

    next();
  } catch (error) {
    next(error);
  }
};
