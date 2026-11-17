import logger from '../utils/logger.js';
import { errorObject } from '../utils/response.js';

const KNOWN_ERRORS = [
  [(err) => err.message === 'Not allowed by CORS', 403, 'Access forbidden'],
  [(err) => err.type === 'entity.parse.failed', 400, 'The request could not be read.'],
];

const errorHandler = (err, req, res, _next) => {
  logger.error(`Error ${req.method} ${req.originalUrl}`, {
    error: err.message,
    stack: err.stack,
    requestId: req.requestId,
    params: req.params,
    query: req.query,
  });

  const known = KNOWN_ERRORS.find(([matches]) => matches(err));
  const errorObj = known
    ? errorObject(Object.assign(new Error(known[2]), { statusCode: known[1] }), req, known[1])
    : errorObject(err, req, err.statusCode || err.status || 500);

  return res.status(errorObj.statusCode).json(errorObj);
};

const notFoundHandler = (req, res, _next) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(`404 - ${message}`, {
    method: req.method,
    url: req.originalUrl,
    requestId: req.requestId,
  });

  const errorObj = errorObject(new Error(message), req, 404);
  return res.status(404).json(errorObj);
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { errorHandler, notFoundHandler, asyncHandler };
