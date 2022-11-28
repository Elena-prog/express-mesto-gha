const { Joi } = require('celebrate');
const { REGEXP_URL } = require('../constants');

const { body, params } = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEXP_URL),
  }),
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
};

module.exports = { body, params };
