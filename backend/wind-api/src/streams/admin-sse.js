import { success, failure } from '../utils/response.js';
import { ADMIN_SSE_TYPE } from '../config/contents.js';
import { addSSERequest, writeDataToSSE, getSSEInfo, getTotalCountSSE } from '../utils/sse-manage.js';

const SSE_TYPE = ADMIN_SSE_TYPE;

function initAdminSSE(req, res) {
  try {
    addSSERequest(SSE_TYPE, req, res);
  } catch (error) {
    failure(res, error);
  }
}

function writeSSEInfo() {
  const data = {
    sseList: getSSEInfo(),
    total: getTotalCountSSE(),
  };

  writeDataToSSE(SSE_TYPE, data);
}

export { initAdminSSE, writeSSEInfo };
