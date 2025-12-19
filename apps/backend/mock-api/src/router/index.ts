import type { Router } from 'express';
import express from 'express';
import { corsMiddleware } from '../middleware/cors';
import { authMiddleware } from './../middleware/auth';
import errorRouters from './error';
import heroRouters from './hero';

const router: Router = express.Router();

router.use('/hero', authMiddleware, heroRouters);
router.use('/error', corsMiddleware, errorRouters);

export default router;
