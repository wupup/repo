import express from 'express';

import { userAuth } from '../middleware/auth.js';

import { get_all_user, get_user, add_user, update_user } from '../controllers/user.js';

const router = express.Router();

router.get('/', userAuth, get_user);
router.get('/all', get_all_user);
router.post('/add', add_user);
router.post('/update', userAuth, update_user);

export default router;
