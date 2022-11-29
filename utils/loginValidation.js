const { Joi } = require('celebrate');
const { REGEXP_URL } = require('../constants');

const registrationValidation = {
  body: Joi.object().keys({
    email: Joi.string().required(true).email(),
    password: Joi.string().required(true),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEXP_URL),
  }),
};

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required(true).email(),
    password: Joi.string().required(true),
  }),
};

module.exports = { registrationValidation, loginValidation };
