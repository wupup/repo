import HttpErrors from 'http-errors';

import redis from '../utils/redis.js';
import { getCodeMailData } from '../utils/mailer.js';
import { mailProducer } from '../utils/rabbitmq.js';
import { validateEmail } from '../utils/validator.js';
import { success, failure } from '../utils/response.js';

const CODE_TYPES = ['register', 'reset_password', 'change_email'];

const mail_send_code = async (req, res) => {
  try {
    const { email, type = 'register' } = req.body;

    if (!email) {
      throw new HttpErrors.BadRequest('缺少邮箱地址');
    }

    if (!CODE_TYPES.includes(type)) {
      throw new HttpErrors.BadRequest('验证码类型不正确');
    }

    if (!validateEmail(email)) {
      throw new HttpErrors.BadRequest('邮箱地址格式不正确');
    }

    const code = Math.random().toString().slice(2, 8);
    const mailData = getCodeMailData(email, code);
    await mailProducer(mailData);
    await redis.setKey(`${type}_code:${email}`, code, 'EX', 300);

    success(res, { email }, '验证码已发送至您的邮箱，有效期5分钟');
  } catch (error) {
    failure(res, error);
  }
};

export { mail_send_code };
