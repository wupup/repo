import type { Response } from 'express';
import { RES_CODE } from './contents';

interface Result {
  code: string;
  success: boolean;
  message: string;
  data: any;
}

function success(res: Response, data = {}) {
  const result: Result = {
    code: RES_CODE.SUCCESS,
    success: true,
    message: 'success',
    data,
  };
  res.json(result);
}

function failure(res: Response, err: Error) {
  const result: Result = {
    code: RES_CODE.ERROR,
    success: false,
    message: err.message || 'failure',
    data: null,
  };
  res.json(result);
}

export { success, failure };
