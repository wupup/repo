import Errors from 'http-errors';

import { failure } from '../utils/response.js';

const error_get = async (req, res) => {
  try {
    throw new Errors.Forbidden('请求出错了 T_T');
  } catch (error) {
    failure(res, error);
  }
};

export { error_get };
