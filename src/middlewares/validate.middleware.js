const { BadRequestError } = require("../errors");

module.exports =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        message: d.message,
        path: d.path,
      }));
      return next(new BadRequestError("errors.validation.failed", { details }));
    }

    req[property] = value;
    next();
  };
