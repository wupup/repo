import HttpErrors from 'http-errors';

import logger from './logger.js';
import { RES_CODE } from '../config/contents.js';

function success(res, data = {}, message = 'success') {
  const result = {
    code: RES_CODE.SUCCESS,
    success: true,
    message,
    data,
  };
  res.json(result);
}

function failure(res, err) {
  const result = {
    code: RES_CODE.ERROR,
    success: false,
    message: err.message,
    data: null,
  };

  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
    result.code = RES_CODE.TOKEN_ERROR;
    result.message = 'token错误或已过期';
  } else if (HttpErrors.isHttpError(err)) {
    result.code = err.status || RES_CODE.ERROR;
    result.message = err.message;
  } else {
    result.message = '服务器错误';
    logger.error('服务器错误', err);
  }

  res.json(result);
}

export { success, failure };
