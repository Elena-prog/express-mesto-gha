const handleError = (err, req, res, next) => {
  if (err) {
    const { statusCode = 500, message } = err;
    return res
      .status(statusCode)
      .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  }
  return next();
};

module.exports = handleError;
