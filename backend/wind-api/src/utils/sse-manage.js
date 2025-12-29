// 管理所有的 SSE 连接
import HttpErrors from 'http-errors';

import logger from '../utils/logger.js';
import { success, failure } from '../utils/response.js';
import { ADMIN_SSE_TYPE } from '../config/contents.js';
import { writeSSEInfo } from '../streams/admin-sse.js';

// 单类型最大连接数
const MAX_LEN = 10;

// 总最大连接数
const TOTAL_MAT_LEN = 50;

const RAW_REQ_KRY = '__raw_req__';

const sseMap = new Map();

function addSSERequest(type, req, res) {
  if (!type) {
    failure(res, new HttpErrors.ExpectationFailed('未知的SSE连接类型'));
  }

  if (!sseMap.has(type)) {
    sseMap.set(type, new Set());
  }
  const theTypeSetSSE = sseMap.get(type);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res[RAW_REQ_KRY] = req;
  res.__linked_time__ = new Date().toLocaleString();

  res.on('close', () => {
    theTypeSetSSE.delete(res);
    res.end(JSON.stringify({ message: '连接关闭' }));
    writeSSEInfo();
  });

  const totalCount = getTotalCountSSE();

  if (type !== ADMIN_SSE_TYPE && totalCount >= TOTAL_MAT_LEN) {
    res.end(JSON.stringify({ message: '超出最大总连接数' }));
    logger.warn(`[SSE Manage] =>> 超出最大总连接数: ${type}:${TOTAL_MAT_LEN}`);
    return;
  }

  theTypeSetSSE.add(res);
  writeSSEInfo();

  if (theTypeSetSSE.size > MAX_LEN) {
    // 第一个连接
    for (const itemRes of theTypeSetSSE) {
      theTypeSetSSE.delete(itemRes);
      writeSSEInfo();
      itemRes.end({ message: `超出最大连接数` });
      logger.warn(`[SSE Manage] =>> 超出当前类型最大连接数: ${type}:${MAX_LEN}`);
      break;
    }
  }
}

function writeDataToSSE(type, data) {
  if (!type) return;
  const theTypeSetSSE = sseMap.get(type);
  // console.log(`writeDataToSSE type =>> ${type}`);
  if (!theTypeSetSSE?.size) return;
  for (const resItem of theTypeSetSSE) {
    resItem.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

function endAllSSE() {
  for (const itemSet of sseMap.values()) {
    for (const itemReq of itemSet) {
      itemReq.end(JSON.stringify({ message: '服务器关闭连接' }));
    }
  }
}

function getTotalCountSSE() {
  const totalCount = [...sseMap.values()].reduce((count, itemSet) => {
    return count + itemSet.size;
  }, 0);

  return totalCount;
}

function getSSEInfo() {
  const result = [...sseMap].reduce((result, [type, resSet]) => {
    const arr = [...resSet].map(res => {
      return {
        type,
        baseUrl: res[RAW_REQ_KRY].baseUrl,
        startTime: res.__linked_time__,
      };
    });
    return result.concat(arr);
  }, []);

  return result;
}

export { addSSERequest, writeDataToSSE, getSSEInfo, getTotalCountSSE, endAllSSE };
