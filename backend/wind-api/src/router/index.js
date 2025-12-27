import express from 'express';

import { userAuth } from '../middleware/auth.js';

import heroRouters from './hero.js';
import loginRouters from './login.js';
import userRouters from './user.js';
import mailRouters from './mail.js';

const router = express.Router();

router.use('/hero', userAuth, heroRouters);
router.use('/mail', mailRouters);
router.use('/login', loginRouters);
router.use('/user', userRouters);

export default router;
