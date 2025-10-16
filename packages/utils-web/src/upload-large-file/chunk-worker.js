import { createChunk } from './index';

onmessage = async e => {
  const { file, startIndex, endIndex, chunkSize } = e.data;
  const chunkPromiseList = [];

  for (let i = startIndex; i < endIndex; i++) {
    const p = createChunk(file, i, chunkSize);
    chunkPromiseList.push(p);
  }

  const chunks = await Promise.all(chunkPromiseList);
  postMessage(chunks);
};
