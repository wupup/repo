<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Graph } from './Graph';

const cvsRef = ref<HTMLCanvasElement | null>(null);
let ctx = null;

function init() {
  if (!cvsRef.value) return;

  const dpr = window.devicePixelRatio || 1;

  cvsRef.value.width = window.innerWidth * dpr;
  cvsRef.value.height = window.innerHeight * dpr;
  cvsRef.value.style.transformOrigin = `0 0`;
  cvsRef.value.style.transform = `scale(${1 / dpr})`;
  ctx = cvsRef.value.getContext('2d');
  // ctx.scale(dpr, dpr);

  const graph = new Graph(cvsRef.value, 130, 220);
  graph.mousePoint();
  graph.animate();
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
  right: 0;
  top: 0;
  bottom: 0;
  background: #222;
}
</style>
