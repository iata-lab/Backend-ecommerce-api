/* mirar if (process.env.NODE_ENV === 'production') {
  const Sentry = require('@sentry/node');
  Sentry.captureException(error);
} */


const {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ValidationError, 
} = require("../errors");
const {logger} = require("../config/dependencies");

module.exports = (error, req, res, next) => {

  logger.error({
    message: error.message,
    name: error.name,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.userId || "guest",
    statusCode: error.statusCode || 500,
    details: error.details,
  });

  if (process.env.NODE_ENV === "development") {
    return res.status(error.statusCode || 500).json({
      error: error.message,
      stack: error.stack,
      type: error.name,
      details: error.details,
    });
  }

  if (
    error instanceof BadRequestError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError
  ) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: "Error de validación",
      details: error.errors?.map((e) => e.message) || error.details,
    });
  }
  next(); //mirar

  res.status(500).json({
    error: "Error interno del servidor",
    referenceId: req.requestId,
  });
};
