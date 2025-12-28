import schedule from 'node-schedule';

import logger from '../utils/logger.js';

import { prisma } from '../utils/prisma.js';

function scheduleCountUsers() {
  // 每天 4:30 执行
  schedule.scheduleJob('* 30 4 * * *', countUsers);
}

// 大数据量需要使用消息队列分批处理
async function countUsers() {
  logger.info('[schedule tasks] 开始执行定时任务: countUsers');
  try {
    const count = await prisma.user.count();
    await prisma.count.create({
      data: {
        type: 'usersCount',
        count,
      },
    });
  } catch (error) {
    logger.error('[schedule tasks] 定时任务执行失败', error);
  }
}

export default scheduleCountUsers;
