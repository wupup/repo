<script setup>
import { onMounted } from 'vue';
import { performTask, idlePerformTask, rafPerformTask, timeoutPerformTask } from './performTask';

onMounted(() => {
  const container = document.querySelector('.dom-container');
  const tasks = new Array(200000).fill(null).map((_, index) => () => {
    const div = document.createElement('div');
    div.textContent = `Task ${index + 1}`;
    container.appendChild(div);
  });

  function normalRun() {
    performTask(tasks, runChunk => {
      runChunk(_ => true);
    });
  }

  // normalRun();
  // idlePerformTask(tasks);
  // rafPerformTask(tasks, 10);
  timeoutPerformTask(tasks, 10, 500);
});
</script>

<template>
  <div class="dom-container"></div>
</template>

<style lang="scss" scoped></style>
