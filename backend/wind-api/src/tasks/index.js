import logger from '../utils/logger.js';

import scheduleCountUsers from './count-users.js';

function initScheduleTasks() {
  logger.info('[schedule tasks] =>> 开始启动定时任务');
  try {
    // 统计用户数
    scheduleCountUsers();
  } catch (error) {
    logger.error('[schedule tasks] 定时任务启动失败', error);
  }
}

export { initScheduleTasks };
