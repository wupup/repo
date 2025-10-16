import SparkMD5 from 'spark-md5';

const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB
const THREAD_COUNT = navigator.hardwareConcurrency || 4; // 线程数量 navigator.hardwareConcurrency

export type Chunk = {
  index: number;
  start: number;
  end: number;
  blob: Blob;
  hash?: string;
};

export type MsgData = {
  file: File;
  startIndex: number;
  endIndex: number;
  chunkSize: number;
};

async function uploadLargeFile(file: File, chunkSize?: number): Promise<void> {
  console.time('cutFile');
  const chunks = await cutFileMultithreading(file, chunkSize);
  console.timeEnd('cutFile');
  console.log('uploadLargeFile chunks =>> ', chunks);
}

async function cutFile(file: File, chunkSize: number = CHUNK_SIZE): Promise<Chunk[]> {
  if (!file) return [];
  if (chunkSize <= 0) chunkSize = CHUNK_SIZE;
  const chunkCount = Math.ceil(file.size / chunkSize);
  const chunkList: Chunk[] = [];
  for (let i = 0; chunkCount; i++) {
    const chunk = await createChunk(file, i, chunkSize);
    chunkList.push(chunk);
  }
  return chunkList;
}

function cutFileMultithreading(file: File, chunkSize: number = CHUNK_SIZE): Promise<Chunk[]> {
  if (!file) return Promise.resolve([]);
  if (chunkSize <= 0) chunkSize = CHUNK_SIZE;
  return new Promise(resolve => {
    const chunkCount = Math.ceil(file.size / chunkSize);
    const threadCount = Math.min(THREAD_COUNT, chunkCount); // 线程数不能超过分片数
    // 计算每个线程处理的分片数
    const threadChunkCount = Math.ceil(chunkCount / threadCount);
    const threadResult: Chunk[][] = [];
    let finishCount = 0;

    for (let i = 0; i < threadCount; i++) {
      const worker = new Worker(new URL('./chunk-worker.js', import.meta.url), {
        type: 'module',
      });

      worker.postMessage({
        file,
        startIndex: i * threadChunkCount,
        endIndex: Math.min((i + 1) * threadChunkCount, chunkCount),
        chunkSize,
      });

      worker.onmessage = (e: MessageEvent<Chunk[]>) => {
        threadResult[i] = e.data;
        worker.terminate();
        finishCount++;
        if (finishCount === threadCount) {
          resolve(threadResult.flat());
        }
      };
    }
  });
}

function createChunk(file: File, index: number, chunkSize: number): Promise<Chunk> {
  return new Promise(resolve => {
    const start = index * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const blob = file.slice(start, end);

    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        spark.append(e.target.result as ArrayBuffer);
        const hash = spark.end();
        const chunk: Chunk = { index, start, end, blob, hash };
        resolve(chunk);
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

export { uploadLargeFile, cutFile, cutFileMultithreading, createChunk };
