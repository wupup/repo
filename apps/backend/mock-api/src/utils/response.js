import Errors from 'http-errors';

import { RES_CODE } from './contents.js';

function success(res, data = {}) {
  const result = {
    code: RES_CODE.SUCCESS,
    success: true,
    message: 'success',
    data,
  };
  res.json(result);
}

function failure(res, err) {
  const result = {
    code: RES_CODE.ERROR,
    success: false,
    message: err.message || 'failure',
    data: null,
  };

  console.error('failure error =>> ', err.name, err.status, err.message);

  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
    result.code = RES_CODE.TOKEN_ERROR;
    result.message = 'token错误或已过期';
  } else if (Errors.isHttpError(err)) {
    result.code = err.status || RES_CODE.ERROR;
    result.message = err.message;
  }

  res.json(result);
}

export { success, failure };
