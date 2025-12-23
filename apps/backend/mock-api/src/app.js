import path from 'node:path';
import crypto from 'node:crypto';

import { configDotenv } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import express from 'express';

import routers from './router/index.js';

const app = express();

configDotenv();

const corsOptions = {
  origin: '*',
};

console.log('crypto =>> ', crypto.randomBytes(32).toString('hex'));

app.use(morgan('combined'));

app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions));

app.use(routers);

export default app;
