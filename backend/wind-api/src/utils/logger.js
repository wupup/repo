import winston from 'winston';
import Transport from 'winston-transport';

import { prisma } from './prisma.js';
import { config } from '../config/index.js';

class PrismaTransport extends Transport {
  constructor(opts = {}) {
    super(opts);

    this.prisma = opts.prisma;

    // 可选：设置最大重试或错误处理策略
    this.handleExceptions = opts.handleExceptions ?? false;
  }

  // 核心方法：Winston 调用此方法写入日志
  async log(info, callback) {
    const { level, message, timestamp, ...meta } = info;

    try {
      await this.prisma.log.create({
        data: {
          level,
          message: message || '',
          meta: Object.keys(meta).length > 0 ? meta : undefined,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        },
      });

      // 成功后调用 callback（无 error）
      callback();
    } catch (error) {
      // ⚠️ 即使数据库失败，也不要抛出异常阻塞主程序！
      console.error('Failed to write log to database =>>', error.message);

      // 仍调用 callback，但可传入 error（Winston 会处理）
      callback(error);
    }
  }
}

const prismaTransport = new PrismaTransport({
  prisma,
  level: 'info', // 只记录 info 及以上级别
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'wind-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    prismaTransport,
  ],
});

if (!config.isProduction) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  );
}

export default logger;
