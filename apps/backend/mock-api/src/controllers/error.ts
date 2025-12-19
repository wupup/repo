import type { Request, Response, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';

import { success, failure } from '../utils/response';

const errorGet: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    throw new Error('请求失败!!!');
    success(res);
  } catch (error) {
    failure(res, error as Error);
  }
});

export { errorGet };
