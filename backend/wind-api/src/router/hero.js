import express from 'express';

import { hero_list_get } from '../controllers/hero.js';

const router = express.Router();

router.get('/list', hero_list_get);

export default router;
