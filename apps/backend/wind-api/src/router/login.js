import express from 'express';

import * as loginController from '../controllers/login.js';

const router = express.Router();

router.post('/', loginController.login);

export default router;
