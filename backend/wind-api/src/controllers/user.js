import { prisma } from '../utils/prisma.js';
import HttpErrors from 'http-errors';

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

const validateUserPassword = async (email, password) => {
  if (!email) throw new HttpErrors.BadRequest('缺少email参数');

  const user = await prisma.user.findUnique({
    where: { email },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new HttpErrors.NotFound('未找到该用户');
  if (user.password !== password) throw new HttpErrors.Unauthorized('密码错误');
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
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
    });

    success(res, users);
  } catch (error) {
    failure(res, error);
  }
};

const get_user = async (req, res) => {
  try {
    const { userId } = req;
    const user = await getUserById(userId);

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

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password,
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

    success(res, user);
  } catch (error) {
    failure(res, error);
  }
};

export { get_user, get_all_user, add_user, update_user, getUserById, validateUserPassword };
