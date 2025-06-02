module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.isOperational
      ? req.__(err.translationKey || err.message)
      : req.__?.("errors.http.internal_server") || "Internal Server Error",
    ...(err.translationKey && { translationKey: err.translationKey }),
    ...(err.errorCode && { errorCode: err.errorCode }),
    ...(err.details && { details: err.details }),
  };

  res.status(statusCode).json(response);
};
