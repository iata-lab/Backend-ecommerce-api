// errors/index.js

class AppError extends Error {
  constructor(
    translationKey,
    statusCode = 500,
    { details = null, isOperational = true, errorCode = null } = {}
  ) {
    super(translationKey || "Unknown error");
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    this.translationKey = translationKey || "errors.unknown";
    this.errorCode = errorCode || `ERR-${statusCode}`;
    this.name = this.constructor.name;

    if (isOperational) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const createHttpErrorClass = (name, statusCode, defaultKey) => {
  return class extends AppError {
    constructor(translationKey = defaultKey, options = {}) {
      super(translationKey, statusCode, options);
      this.name = name;
    }
  };
};

const BadRequestError = createHttpErrorClass("BadRequestError", 400, "errors.bad_request");
const UnauthorizedError = createHttpErrorClass("UnauthorizedError", 401, "errors.http.unauthorized");
const ForbiddenError = createHttpErrorClass("ForbiddenError", 403, "errors.http.forbidden");
const NotFoundError = createHttpErrorClass("NotFoundError", 404, "errors.http.not_found");
const ConflictError = createHttpErrorClass("ConflictError", 409, "errors.conflict");
const ValidationError = createHttpErrorClass("ValidationError", 422, "errors.validation.failed");
const InternalServerError = createHttpErrorClass("InternalServerError", 500, "errors.http.internal_server");

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
};
