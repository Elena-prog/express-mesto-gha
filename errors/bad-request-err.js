const { BAD_REQUEST } = require('../constants');
//console.log('ff');
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequestError;
