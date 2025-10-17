import express from 'express';

import { apiRouter } from './router/api';
import { config } from './config/index';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

const port = config.port;
app.listen(port, () => {
  console.log(`Mock API server is running on http://localhost:${port}`);
});
