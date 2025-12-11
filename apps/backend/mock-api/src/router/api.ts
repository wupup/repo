import type { Router } from 'express';
import express from 'express';

import * as apiController from '../controllers/api';

const apiRouter: Router = express.Router();

apiRouter.get('/hero-list', apiController.hero_list_get);

apiRouter.get('/error', apiController.error_get);

export default apiRouter;
