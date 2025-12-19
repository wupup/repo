import type { Router } from 'express';
import express from 'express';

import * as heroController from '../controllers/hero';

const router: Router = express.Router();

router.get('/list', heroController.heroListGet);

export default router;
