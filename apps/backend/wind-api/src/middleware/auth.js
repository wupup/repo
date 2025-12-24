import jwt from 'jsonwebtoken';
import Errors from 'http-errors';

import { failure } from '../utils/response.js';

export function userAuth(req, res, next) {
  try {
    const { token } = req.headers;
    if (!token) {
      throw new Errors.Unauthorized('未授权');
    }

    const data = jwt.verify(token, process.env.SECRET);
    const { userId } = data;

    req.userId = userId;
    next();
  } catch (error) {
    failure(res, error);
  }
}
