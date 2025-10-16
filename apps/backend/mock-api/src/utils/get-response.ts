import { RES_CODE } from './contents';

interface Result {
  code: string;
  success: boolean;
  message: string;
  data: any;
}

export const getResponseResult = (data: any, code: string, msg = ''): Result => {
  if (code === RES_CODE.SUCCESS) {
    return getSuccessResponseResult(data);
  } else {
    return getErrorResponseResult(code, msg);
  }
};

export function getSuccessResponseResult(data: any): Result {
  return {
    code: '0000',
    success: true,
    data,
    message: 'ok',
  };
}

export function getErrorResponseResult(code: string, msg: string): Result {
  return {
    code,
    success: false,
    data: null,
    message: msg,
  };
}

export function getCommonErrorResponseResult(msg: string): Result {
  return getErrorResponseResult(RES_CODE.ERROR, msg);
}
