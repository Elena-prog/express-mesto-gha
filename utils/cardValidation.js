const { Joi } = require('celebrate');
const { REGEXP_URL } = require('../constants');

const createCardValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(true),
    link: Joi.string().required(true).regex(REGEXP_URL),
  }),
};

const paramsValidation = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().required(true).length(24),
  }),
};

module.exports = { createCardValidation, paramsValidation };
