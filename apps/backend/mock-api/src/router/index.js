import express from 'express';

import { userAuth } from '../middleware/auth.js';

import errorRouters from './error.js';
import heroRouters from './hero.js';
import loginRouters from './login.js';

const router = express.Router();

router.use('/error', errorRouters);
router.use('/hero', userAuth, heroRouters);
router.use('/login', loginRouters);

export default router;
