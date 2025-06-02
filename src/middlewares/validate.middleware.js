const { BadRequestError } = require("../errors/index");

module.exports =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new BadRequestError("errors.validation.failed", { details }));
    }

    next();
  };
