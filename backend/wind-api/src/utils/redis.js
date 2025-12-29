// src/redisClient.js
import { Redis } from 'ioredis';

import logger from './logger.js';

let redisClient = null;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis({
      keyPrefix: 'wind-api:',
      host: process.env.REDIS_HOST || '',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || '',
      retryStrategy(times) {
        if (times > 3) {
          return null; // Stop retrying after 5 attempts
        }
        return Math.min(times * 50, 500); // Reconnect after
      },
    });

    redisClient.on('error', err => {
      logger.error('❌ [redis] 连接失败', err);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Connected to Redis');
    });

    redisClient.on('ready', () => {
      logger.info('🚀 Redis client is ready');
    });
  }

  return redisClient;
}

async function setKey(key, value, ...params) {
  if (!key) throw new Error('redis setKey: Key is required');
  const redis = getRedisClient();
  if (typeof value === 'object' && value !== null) {
    value = JSON.stringify(value);
  }
  return await redis.set(key, value, ...params);
}

async function getKey(key, ...params) {
  if (!key) return null;
  const redis = getRedisClient();
  const value = await redis.get(key, ...params);
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

async function delKey(key) {
  const redis = getRedisClient();
  if (!Array.isArray(key)) {
    key = [key];
  }
  return await redis.del(...key);
}

async function getDataWithCache(key, getData) {
  let _getData = null;
  if (typeof getData !== 'function') {
    _getData = () => getData;
  } else {
    _getData = getData;
  }

  try {
    const cachedData = await getKey(key);
    if (cachedData) {
      return cachedData;
    }

    const data = await _getData();
    await setKey(key, data);

    return data;
  } catch (error) {
    logger.error('[function:getDataWithCache]', error);
    return await _getData();
  }
}

export default {
  getRedisClient,
  getDataWithCache,
  getKey,
  setKey,
  delKey,
};
