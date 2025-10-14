type Task = () => void;

/**
 * 分布执行任务
 * @param {Function[]} tasks 任务列表
 * @param {Function} scheduler 调度器
 * @description
 * scheduler 接收一个函数 runChunk，runChunk 接收一个函数 isGoOn
 * isGoOn 用于判断是否继续执行下一个任务，返回 true 则继续执行下一个任务，返回 false 则暂停执行等待下一次调度
 */
function performTask(tasks: Task[], scheduler: (runChunk: (isGoOn: () => boolean) => void) => void) {
  let index = 0;

  function _run() {
    scheduler(isGoOn => {
      while (index < tasks.length && isGoOn()) {
        tasks[index++]!();
      }

      if (index < tasks.length) {
        _run();
      }
    });
  }

  _run();
}

/**
 * 使用 requestIdleCallback 分布执行任务
 * @param {Function[]} tasks 任务列表
 * @description 使用 requestIdleCallback 分布执行任务
 */
function idlePerformTask(tasks: Task[]) {
  performTask(tasks, runChunk => {
    requestIdleCallback(deadline => {
      runChunk(() => deadline.timeRemaining() > 0);
    });
  });
}

/**
 * 使用 requestAnimationFrame 分布执行任务
 * @param {Function[]} tasks 任务列表
 * @param {Number} frameTimes 每帧执行几个任务
 */
function rafPerformTask(tasks: Task[], frameTimes = 1) {
  performTask(tasks, runChunk => {
    let count = 0;
    requestAnimationFrame(() => {
      runChunk(() => count++ < frameTimes);
    });
  });
}

/**
 * 使用 setTimeout 分布执行任务
 * @param {Function[]} tasks 任务列表
 * @param {Number} frameTimes 每次执行几个任务
 * @param {Number} timeout 每次执行的间隔时间
 */
function timeoutPerformTask(tasks: Task[], frameTimes = 1, timeout = 16) {
  performTask(tasks, runChunk => {
    let count = 0;
    setTimeout(() => {
      runChunk(() => count++ < frameTimes);
    }, timeout);
  });
}

export { performTask, idlePerformTask, rafPerformTask, timeoutPerformTask };
