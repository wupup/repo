// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

import { getCommonErrorResponseResult } from '../utils/get-response';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const msg = process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message;
  res.status(500).json(getCommonErrorResponseResult(msg));
};
