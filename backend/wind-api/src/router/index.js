import express from 'express';

import { userAuth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/admin-auth.js';

import heroRouters from './hero.js';
import loginRouters from './login.js';
import userRouters from './user.js';
import mailRouters from './mail.js';

// admin 路由
import sseRouters from './admin/sse.js';

const router = express.Router();

router.use('/hero', userAuth, heroRouters);
router.use('/mail', mailRouters);
router.use('/login', loginRouters);
router.use('/user', userRouters);

// admin 路由
router.use('/admin', adminAuth, sseRouters);

export default router;
