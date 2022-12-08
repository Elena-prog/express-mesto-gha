const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const { KEY = 'dev-secret' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Токен не передан'));
  }
  let payload;
  try {
    payload = jwt.verify(token, KEY);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
