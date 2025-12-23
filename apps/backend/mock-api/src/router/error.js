import express from 'express';

import * as errorController from '../controllers/error.js';

const router = express.Router();

router.get('/', errorController.error_get);

export default router;
