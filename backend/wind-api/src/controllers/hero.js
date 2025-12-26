import axios from 'axios';

import { success, failure } from '../utils/response.js';

const URLS = {
  HERO_LIST: 'https://pvp.qq.com/web201605/js/herolist.json', // 英雄列表
};

const hero_list_get = async (req, res) => {
  try {
    const response = await axios.get(URLS.HERO_LIST);

    success(res, response.data);
  } catch (error) {
    failure(res, error);
  }
};

export { hero_list_get };
