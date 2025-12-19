/**
 * 节流函数
 */

interface ThrottledFunction<T extends (...args: any[]) => any> {
  (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> | void;
  // cancel: () => void;
}

export function throttleSimple<T extends (...args: any[]) => any>(fn: T, wait = 200): ThrottledFunction<T> {
  let lastExecuteTime = 0;

  return function (...args: []) {
    const now = Date.now();
    if (now - lastExecuteTime > wait) {
      lastExecuteTime = now;
      return fn.apply(this, args);
    }
  };
}

/**
 * 节流函数 - 在指定时间间隔内只执行一次函数
 * @param fn 要执行的函数
 * @param wait 节流时间间隔（毫秒）
 * @param options 配置选项
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait = 200,
  options: {
    leading?: boolean; // 是否在节流开始时调用
    trailing?: boolean; // 是否在节流结束后调用
  } = {},
): {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void; // 取消延迟调用
  flush: () => void; // 立即执行 pending 的调用
} {
  const { leading = true, trailing = true } = options;

  let lastExecuteTime = 0;
  let timer: number | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any;

  // 执行函数
  const invokeFunc = (time: number) => {
    lastExecuteTime = time;
    if (lastArgs) {
      const result = fn.apply(lastThis, lastArgs);
      timer = null;
      lastArgs = null;
      lastThis = null;
      return result;
    }
  };

  // 延迟执行函数
  const delayedInvoke = (time: number) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (trailing && lastArgs) {
      timer = setTimeout(() => {
        invokeFunc(time);
      }, wait);
    }
  };

  // 节流函数主体
  const throttled = function (this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const now = Date.now();
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    // 计算剩余时间
    const remaining = wait - (now - lastExecuteTime);

    // 如果是首次调用且 leading 为 true，或者已经超过等待时间
    if ((leading && lastExecuteTime === 0) || remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      return invokeFunc(now);
    }
    // 如果没有设置定时器且 trailing 为 true
    else if (!timer && trailing) {
      delayedInvoke(now);
    }
  };

  // 取消延迟调用
  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
    lastThis = null;
    lastExecuteTime = 0;
  };

  // 立即执行 pending 的调用
  throttled.flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    return invokeFunc(Date.now());
  };

  return throttled;
}
