const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    "string.base": "errors.validation.name_format",
    "string.min": "errors.validation.name_length",
    "string.max": "errors.validation.name_length",
    "any.required": "errors.validation.required",
  }),
  parent_category: Joi.number().integer().allow(null).messages({
    "number.base": "errors.validation.parent_format",
    "number.integer": "errors.validation.parent_format",
  }),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(255).messages({
    "string.base": "errors.validation.name_format",
    "string.min": "errors.validation.name_length",
    "string.max": "errors.validation.name_length",
  }),
  parent_category: Joi.number().integer().allow(null).messages({
    "number.base": "errors.validation.parent_format",
    "number.integer": "errors.validation.parent_format",
  }),
}).min(1).messages({
  "object.min": "errors.validation.no_valid_fields",
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
