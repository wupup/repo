import express from 'express';
import { apiRouter } from './router/api';

const port = process.env.PORT || 9527;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`Mock API server is running on http://localhost:${port}`);
});
