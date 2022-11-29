const { Joi } = require('celebrate');
const { REGEXP_URL } = require('../constants');

const updateUserValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).required(true).max(30),
    about: Joi.string().min(2).required(true).max(30),
  }),
};

const paramsValidation = {
  params: Joi.object().keys({
    userId: Joi.string().hex().required(true).length(24),
  }),
};

const avatarValidation = {
  body: Joi.object().keys({
    avatar: Joi.string().required(true).regex(REGEXP_URL),
  }),
};

module.exports = { updateUserValidation, paramsValidation, avatarValidation };
