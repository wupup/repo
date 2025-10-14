<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Graph } from './Graph';

const cvsRef = ref<null | HTMLCanvasElement>(null);
let ctx = null;

function init() {
  const cvs = cvsRef.value;
  if (!cvs) return;

  const dpr = window.devicePixelRatio || 1;

  cvs.width = window.innerWidth * dpr;
  cvs.height = window.innerHeight * dpr;
  cvs.style.transformOrigin = `0 0`;
  cvs.style.transform = `scale(${1 / dpr})`;
  ctx = cvs.getContext('2d');
  // ctx.scale(dpr, dpr);

  const graph = new Graph(cvs);
  graph.draw();
}

onMounted(() => {
  init();
});
</script>

<template>
  <canvas id="cvs" ref="cvsRef" />
</template>

<style scoped>
#cvs {
  position: fixed;
  left: 0;
  /* right: 0; */
  top: 0;
  /* bottom: 0; */
  background: #222;
}
</style>
