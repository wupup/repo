import HttpErrors from 'http-errors';
import bcrypt from 'bcryptjs';

import { prisma } from '../utils/prisma.js';
import redis from '../utils/redis.js';

import { success, failure } from '../utils/response.js';

const getUserById = async id => {
  id = Number(id);
  if (!id) throw new HttpErrors.BadRequest('缺少id参数');

  const user = await prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new HttpErrors.NotFound('未找到该用户');

  return user;
};

/**
 *
 * @param {string} account email or userId
 * @param {string} password
 * @returns User
 */
const validateUserPassword = async (account, password) => {
  if (!account) throw new HttpErrors.BadRequest('缺少账号或邮箱');

  let conditions = { email: account };

  if (/^\d+$/.test(account)) {
    conditions = {
      id: Number(account),
    };
  }

  const user = await prisma.user.findUnique({
    where: conditions,
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new HttpErrors.NotFound('未找到该用户');

  const isValid = bcrypt.compareSync(password, user.password);

  if (!isValid) {
    throw new HttpErrors.Unauthorized('密码错误');
  }

  delete user.password;
  return user;
};

const filterUserBody = req => {
  const { email, name, avatar } = req.body;

  if (!email) {
    throw new HttpErrors.BadRequest('缺少email参数');
  }

  if (!name) {
    throw new HttpErrors.BadRequest('缺少name参数');
  }

  return { email, name, avatar };
};

const get_all_user = async (req, res) => {
  try {
    const users = await redis.getDataWithCache('user:all', async () => {
      return await prisma.user.findMany({
        omit: {
          password: true,
        },
      });
    });

    success(res, users);
  } catch (error) {
    failure(res, error);
  }
};

const get_user = async (req, res) => {
  try {
    const { userId } = req;
    const user = await redis.getDataWithCache(`user:${userId}`, async () => {
      return await getUserById(userId);
    });

    success(res, user);
  } catch (error) {
    failure(res, error);
  }
};

const add_user = async (req, res) => {
  try {
    const userData = filterUserBody(req);
    const { password, rePassword } = req.body;
    if (!password) {
      throw new HttpErrors.BadRequest('缺少password参数');
    }
    if (password !== rePassword) {
      throw new HttpErrors.BadRequest('两次输入的密码不一致');
    }

    const user = await prisma.user.findUnique({
      where: { email: userData.email },
      select: {
        id: true,
        email: true,
      },
    });

    if (user) {
      throw new HttpErrors.Conflict('该邮箱已被注册');
    }

    const encryptedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: encryptedPassword,
      },
    });

    delete newUser.password;
    success(res, newUser);
  } catch (error) {
    failure(res, error);
  }
};

const update_user = async (req, res) => {
  try {
    const { userId } = req;
    const { name, avatar } = req.body;

    if (!name) {
      throw new HttpErrors.BadRequest('用户名不能为空');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        avatar,
      },
      omit: {
        password: true,
      },
    });

    redis.delKey([`user:${userId}`, 'user:all']);

    success(res, user);
  } catch (error) {
    failure(res, error);
  }
};

const modify_password = async (req, res) => {
  try {
    const { userId } = req;
    const { password, newPassword, rePassword } = req.body;

    if (!password || !newPassword || !rePassword) {
      throw new HttpErrors.BadRequest('请求参数不能正确');
    }

    if (newPassword !== rePassword) {
      throw new HttpErrors.BadRequest('两次输入的密码不一致');
    }

    await validateUserPassword(userId, password);
    const encryptedPassword = bcrypt.hashSync(newPassword, 10);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        password: encryptedPassword,
      },
      omit: {
        password: true,
      },
    });

    success(res, user);
  } catch (error) {
    failure(res, error);
  }
};

export { get_user, get_all_user, add_user, update_user, modify_password, getUserById, validateUserPassword };
