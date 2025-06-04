const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    "string.base": "errors.validation.name_format",
    "any.required": "errors.validation.required",
  }),
  description: Joi.string().min(1).required().messages({
    "string.base": "errors.validation.description_format",
    "any.required": "errors.validation.required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "errors.validation.price_format",
    "number.min": "errors.validation.price_positive",
    "any.required": "errors.validation.required",
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).messages({
    "string.base": "errors.validation.name_format",
  }),
  description: Joi.string().min(1).messages({
    "string.base": "errors.validation.description_format",
  }),
  price: Joi.number().min(0).messages({
    "number.base": "errors.validation.price_format",
    "number.min": "errors.validation.price_positive",
  }),
}).min(1);

module.exports = {
  createProductSchema,
  updateProductSchema,
};
