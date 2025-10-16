import { Router, Request, Response } from 'express';
import axios from 'axios';

import { getSuccessResponseResult, getCommonErrorResponseResult } from '../utils/get-response';

const apiRouter: Router = Router();

const URLS = {
  HERO_LIST: 'https://pvp.qq.com/web201605/js/herolist.json', // 王者荣耀英雄列表
};

apiRouter.get('/hero-list', async (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    const response = await axios.get(URLS.HERO_LIST);
    res.json(getSuccessResponseResult(response.data));
  } catch (error) {
    res.status(500).json(getCommonErrorResponseResult('Failed to fetch data'));
  }
});

apiRouter.get('/error', async (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    throw new Error('请求失败');
    const data = [];
    res.json(getSuccessResponseResult(data));
  } catch (error) {
    res.status(500).json(getCommonErrorResponseResult((error as Error).message || 'Failed to fetch data'));
  }
});

export { apiRouter };
