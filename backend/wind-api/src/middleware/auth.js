import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';

import { failure } from '../utils/response.js';

export function userAuth(req, res, next) {
  try {
    const { token } = req.headers;
    if (!token) {
      throw new HttpErrors.Unauthorized('未授权');
    }

    const data = jwt.verify(token, process.env.SECRET);
    const { userId, email } = data;

    req.userId = userId;
    req.email = email;
    next();
  } catch (error) {
    failure(res, error);
  }
}
