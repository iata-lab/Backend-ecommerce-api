const Joi = require("joi");

const updateUserSchema = Joi.object({
  userName: Joi.string().alphanum().min(3).max(50).messages({
    "string.base": "errors.validation.username_format",
    "string.alphanum": "errors.validation.username_format",
    "string.min": "errors.validation.username_length",
    "string.max": "errors.validation.username_length",
  }),

  email: Joi.string().email().messages({
    "string.base": "errors.validation.email",
    "string.email": "errors.validation.email",
  }),

  password: Joi.string().min(8).max(255).messages({
    "string.base": "errors.validation.password",
    "string.min": "errors.validation.password_length",
    "string.max": "errors.validation.password_length",
  }),

  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .when("password", {
      is: Joi.exist(),
      then: Joi.required(),
    })
    .messages({
      "any.only": "errors.auth.confirmation_required",
      "any.required": "errors.auth.confirmation_required",
    }),
}).min(1);

module.exports = {
  updateUserSchema,
};
