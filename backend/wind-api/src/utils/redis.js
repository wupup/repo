// src/redisClient.js
import { Redis } from 'ioredis';

let redisClient = null;

function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis({
      keyPrefix: 'wind-api:',
      host: process.env.REDIS_HOST || '',
      port: process.env.REDIS_PORT || 6379,
      retryStrategy(times) {
        if (times > 5) {
          return null; // Stop retrying after 5 attempts
        }
        return Math.min(times * 50, 500); // Reconnect after
      },
    });

    redisClient.on('error', err => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    redisClient.on('ready', () => {
      console.log('🚀 Redis client is ready');
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
  console.log('value =>> ', value);
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
  const cachedData = await getKey(key);
  if (cachedData) {
    return cachedData;
  }
  let data = null;
  if (typeof getData === 'function') {
    data = await getData();
  } else {
    data = getData;
  }
  await setKey(key, data);
  return data;
}

export default {
  getRedisClient,
  getDataWithCache,
  getKey,
  setKey,
  delKey,
};
