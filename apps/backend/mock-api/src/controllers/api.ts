import type { Request, Response, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

import { getSuccessResponseResult, getCommonErrorResponseResult } from '../utils/get-response';

const URLS = {
  HERO_LIST: 'https://pvp.qq.com/web201605/js/herolist.json', // 王者荣耀英雄列表
};

export const hero_list_get: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  // res.header('Access-Control-Allow-Origin', '*');
  try {
    const response = await axios.get(URLS.HERO_LIST);
    res.json(getSuccessResponseResult(response.data));
  } catch (error) {
    res.status(500).json(getCommonErrorResponseResult('Failed to fetch data'));
  }
});

export const error_get: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  res.header('Access-Control-Allow-Origin', '*');
  try {
    throw new Error('请求失败!!!');
    const data = [];
    res.json(getSuccessResponseResult(data));
  } catch (error) {
    res.status(500).json(getCommonErrorResponseResult((error as Error).message || 'Failed to fetch data'));
  }
});
