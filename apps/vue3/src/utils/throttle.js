// 节流
export function throttle(fn, wait = 200) {
  let lastExecuteTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastExecuteTime > wait) {
      lastExecuteTime = now;
      fn.apply(this, args);
    }
  };
}
