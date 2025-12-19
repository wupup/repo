import type { Request, Response, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

import { success, failure } from '../utils/response';

const URLS = {
  HERO_LIST: 'https://pvp.qq.com/web201605/js/herolist.json', // 王者荣耀英雄列表
};

const heroListGet: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  try {
    const response = await axios.get(URLS.HERO_LIST);

    success(res, response.data);
  } catch (error) {
    failure(res, error as Error);
  }
});

export { heroListGet };
