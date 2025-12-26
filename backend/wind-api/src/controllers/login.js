import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';

import { success, failure } from '../utils/response.js';
import { validateUserPassword } from './user.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await validateUserPassword(email, password);

    if (!user) {
      throw new HttpErrors.Unauthorized('登陆验证失败');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET, {
      expiresIn: '300s',
    });

    success(res, { user, token });
  } catch (error) {
    failure(res, error);
  }
};

export { login };
