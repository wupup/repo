import HttpErrors from 'http-errors';

import logger from '../utils/logger.js';
import { success, failure } from '../utils/response.js';
import { prisma } from '../utils/prisma.js';

const MAX_LEN = 10;
const clientsList = [];

function initStreamSSE(req, res) {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clientsList.push(res);

    if (clientsList.size > MAX_LEN) {
      const firstReq = clientsList.shift();
      logger.warn('StreamSSE: usersCount =>> 超出最大连接数');
      failure(firstReq, new HttpErrors.TooManyRequests('超出最大连接数'));
    }

    res.on('close', () => {
      res.end();
    });
  } catch (error) {
    failure(res, error);
  }
}

async function usersCount() {
  const count = await prisma.user.count();
  const data = {
    time: new Date(),
    count,
  };

  for (const client of clientsList) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

export { initStreamSSE, usersCount };
