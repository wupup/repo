import { success, failure } from '../utils/response.js';
import { prisma } from '../utils/prisma.js';
import { addSSERequest, writeDataToSSE } from '../utils/sse-manage.js';
import { writeSSEInfo } from './admin-sse.js';

const SSE_TYPE = 'userCount';

function initUsersCountSSE(req, res) {
  try {
    addSSERequest(SSE_TYPE, req, res);
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

  writeDataToSSE(SSE_TYPE, data);
}

export { initUsersCountSSE, usersCount };
