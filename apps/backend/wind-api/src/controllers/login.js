import jwt from 'jsonwebtoken';

import { success, failure } from '../utils/response.js';

const login = async (req, res) => {
  try {
    const token = jwt.sign({ userId: '10000' }, process.env.SECRET, {
      expiresIn: '300s',
    });

    success(res, { token });
  } catch (error) {
    failure(res, error);
  }
};

export { login };
