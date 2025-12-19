import type { Express } from 'express';
import express from 'express';

import routers from './router/index';
import { config } from './config/index';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routers);

// const port = config.port;
// app.listen(port, () => {
//   console.log(`Mock API server is running on http://localhost:${port}`);
// });

export default app;
