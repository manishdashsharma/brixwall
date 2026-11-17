import logger from './logger.js';
import config from '../../config/index.js';
import { EApplicationEnvironment } from '../constant/application.js';

export const responseMessage = {
  ERROR: {
    SOMETHING_WENT_WRONG: 'Something went wrong',
    NOT_FOUND: 'Route not found',
    BAD_REQUEST: 'Bad request',
    VALIDATION_ERROR: 'Validation failed',
    SERVICE_UNAVAILABLE: 'Service unavailable',
  },
  SUCCESS: {
    DEFAULT: 'Success',
    FETCHED: 'Resource fetched successfully',
    HEALTH_CHECK: 'Health check passed successfully',
  },
  custom: (message) => message,
};

const UNEXPECTED_ERROR_MESSAGE = 'Something went wrong on our side. Please try again.';

export const publicError = (err, statusCode = 500) => {
  const message = err instanceof Error ? err.message : '';
  const intended = statusCode < 500 || err?.statusCode >= 500 || err?.expose === true;
  if (message && intended) {
    return { statusCode, message };
  }
  return { statusCode: statusCode >= 500 ? statusCode : 500, message: UNEXPECTED_ERROR_MESSAGE };
};

export const httpResponse = (
  req,
  res,
  responseStatusCode,
  responseMessage,
  data = null
) => {
  const response = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message: responseMessage,
    data,
  };

  logger.info('CONTROLLER_RESPONSE', {
    meta: { statusCode: responseStatusCode, url: req.originalUrl, requestId: req.requestId },
  });

  if (config.env === EApplicationEnvironment.PRODUCTION) {
    delete response.request.ip;
  }

  res.status(responseStatusCode).json(response);
};

export const errorObject = (err, req, errorStatusCode = 500) => {
  const isProduction = config.env === EApplicationEnvironment.PRODUCTION;
  const { statusCode, message } = publicError(err, errorStatusCode);

  const errorObj = {
    success: false,
    statusCode,
    request: {
      ip: req.ip || null,
      method: req.method,
      url: req.originalUrl,
    },
    message,
    data: statusCode < 500 && err?.data ? err.data : null,
  };

  if (isProduction) {
    delete errorObj.request.ip;
  } else if (err instanceof Error) {
    errorObj.trace = { error: err.stack };
  }

  return errorObj;
};

export const httpError = (req, res, err, errorStatusCode = 500) => {
  const errorObj = errorObject(err, req, errorStatusCode);

  logger.error('CONTROLLER_ERROR', {
    meta: errorObj,
    cause: err instanceof Error ? err.message : String(err),
  });

  return res.status(errorObj.statusCode).json(errorObj);
};

export default httpResponse;
