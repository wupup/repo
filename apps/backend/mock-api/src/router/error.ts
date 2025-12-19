import type { Router } from 'express';
import express from 'express';

import * as errorController from '../controllers/error';

const router: Router = express.Router();

router.get('/', errorController.errorGet);

export default router;
