import express from 'express';

import * as heroController from '../controllers/hero.js';

const router = express.Router();

router.get('/list', heroController.hero_list_get);

export default router;
