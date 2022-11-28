const { UNATHORIZED_ERROR } = require('../constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNATHORIZED_ERROR;
  }
}

module.exports = UnauthorizedError;
