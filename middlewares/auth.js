const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const BadRequestError = require('../errors/bad-request-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new BadRequestError('Токен не передан');
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.KEY);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
