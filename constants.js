const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const UNATHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const SERVER_ERROR = 500;
const REGEXP_URL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'*+,;=.]+$/;
const REGEXP_EMAIL = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  UNATHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
  SERVER_ERROR,
  REGEXP_URL,
  REGEXP_EMAIL,
};
