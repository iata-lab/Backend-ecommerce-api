const Joi = require("joi");

const orderIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "errors.validation.required",
    "number.base": "errors.order.invalid_id",
  }),
});

module.exports = {
  orderIdParamSchema,
};
