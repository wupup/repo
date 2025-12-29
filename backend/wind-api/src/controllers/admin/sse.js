import { success, failure } from '../../utils/response.js';
import { initAdminSSE } from '../../streams/admin-sse.js';

const sse_info = async (req, res) => {
  try {
    initAdminSSE(req, res);
  } catch (error) {
    failure(res, error);
  }
};

export { sse_info };
