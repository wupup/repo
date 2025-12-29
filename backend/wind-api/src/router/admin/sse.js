import express from 'express';

import { sse_info } from '../../controllers/admin/sse.js';

const router = express.Router();

router.get('/sse/info', sse_info);

export default router;
