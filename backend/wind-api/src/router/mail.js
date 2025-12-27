import express from 'express';

import { mail_send_code } from '../controllers/mail.js';

const router = express.Router();

router.post('/send/code', mail_send_code);

export default router;
