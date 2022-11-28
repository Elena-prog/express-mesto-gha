const { Joi } = require('celebrate');
const { REGEXP_URL } = require('../constants');

const { body, params } = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(true),
    link: Joi.string().required(true).regex(REGEXP_URL),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

module.exports = { body, params };
