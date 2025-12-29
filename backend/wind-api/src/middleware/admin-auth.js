import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';

import { failure } from '../utils/response.js';
import { prisma } from '../utils/prisma.js';
import redis from '../utils/redis.js';

export async function adminAuth(req, res, next) {
  try {
    const token = req.headers.token || req.query.token;

    if (!token) {
      throw new HttpErrors.Unauthorized('未授权');
    }

    const data = jwt.verify(token, process.env.SECRET);
    const { userId, email } = data;

    const currUser = await redis.getDataWithCache(`user:${userId}`, async () => {
      return await prisma.user.findUnique({
        where: { id: Number(userId) },
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    if (Number(currUser.role) !== 100) {
      throw new HttpErrors.Unauthorized('无权访问');
    }

    req.userId = userId;
    req.email = email;
    next();
  } catch (error) {
    failure(res, error);
  }
}
