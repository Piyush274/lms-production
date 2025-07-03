const Joi = require("joi");

const signUpValidator = Joi.object({
  name: Joi.string().required().messages({
    "*": "name is required",
  }),
  email: Joi.string().required().messages({
    "*": "email is required",
  }),
  password: Joi.string().required().messages({
    "*": "password is required",
  }),
  role: Joi.string().required().messages({
    "*": "role is required",
  }),
});

const signInValidator = Joi.object({
  email: Joi.string().required().messages({
    "*": "email is required",
  }),
  password: Joi.string().required().messages({
    "*": "password is required",
  }),
  fcm_token: Joi.string(),
});

const resetPasswordValidator = Joi.object({
  password: Joi.string().required().messages({
    "*": "password is required",
  }),
  resetPasswordToken: Joi.string().required().messages({
    "*": "resetPasswordToken is required",
  }),
});

const changePasswordValidator = Joi.object({
  currentPassword: Joi.string().required().messages({
    "*": "currentPassword is required",
  }),
  newPassword: Joi.string().required().messages({
    "*": "newPassword is required",
  }),
  changePasswordToken: Joi.string().required().messages({
    "*": "changePasswordToken is required",
  }),
});

const updatePasswordValidator = Joi.object({
  currentPassword: Joi.string().required().messages({
    "*": "currentPassword is required",
  }),
  newPassword: Joi.string().required().messages({
    "*": "newPassword is required",
  }),
});

module.exports = {
  signUpValidator,
  signInValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updatePasswordValidator,
};
