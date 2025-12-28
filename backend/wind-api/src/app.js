import path from 'node:path';
import crypto from 'node:crypto';

import { configDotenv } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import express from 'express';

import logger from './utils/logger.js';
import routers from './router/index.js';
import { mailConsumer } from './utils/rabbitmq.js';
import { initScheduleTasks } from './tasks/index.js';

const app = express();

configDotenv();

const corsOptions = {
  origin: '*',
};

logger.info('crypto =>> ' + crypto.randomBytes(32).toString('hex'));

// 启动邮件消费者
(async () => {
  await mailConsumer();
})();

// 启动定时任务
initScheduleTasks();

// HTTP请求记录器中间件
app.use(morgan('combined'));

app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions));

app.use(routers);

export default app;
