const Joi = require("joi");

const loginSchema = Joi.object({
  credential: Joi.string().required().messages({
    "any.required": "errors.validation.required",
  }),
  password: Joi.string().required().messages({
    "any.required": "errors.validation.required",
  }),
});

const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "errors.validation.email",
    "any.required": "errors.validation.required",
  }),
  userName: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.min": "errors.validation.username_length",
      "string.max": "errors.validation.username_length",
      "string.pattern.base": "errors.validation.username_format",
      "any.required": "errors.validation.required",
    }),
  password: Joi.string().min(8).max(255).required().messages({
    "string.min": "errors.validation.password_length",
    "string.max": "errors.validation.password_length",
    "any.required": "errors.validation.required",
  }),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "string.base": "errors.validation.required",
    "string.empty": "errors.validation.required",
    "any.required": "errors.validation.required",
  }),
});

module.exports = {
  loginSchema,
  signupSchema,
  refreshTokenSchema,
};
