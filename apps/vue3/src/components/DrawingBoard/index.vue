<script setup>
import { onMounted, ref } from 'vue';

import { DrawingBoard } from './DrawingBoard.js';

const canvasRef = ref(null);
const isRubber = ref(false);

let drawingBoard = null;

onMounted(() => {
  const canvas = canvasRef.value;
  drawingBoard = new DrawingBoard(canvas);
  window.drawingBoard = drawingBoard;
  drawingBoard.drawTime();
});

function toggleTools(e) {
  if (drawingBoard) {
    isRubber.value = drawingBoard.isRubber = !drawingBoard.isRubber;
  }
}

function clear() {
  if (drawingBoard) {
    drawingBoard.clearBoard();
  }
}

function getFillList() {
  console.log('drawingBoard.fillRectList =>> ', drawingBoard.getFillList());
}
</script>

<template>
  <canvas id="my-canvas" ref="canvasRef" width="100" height="100" />

  <div class="tools" @click.stop>
    <button @click="toggleTools">
      {{ isRubber ? '画笔' : '橡皮' }}
    </button>
    <button @click="clear">清空</button>
    <button @click="getFillList">获取填充方格</button>
  </div>
</template>

<style scoped>
#my-canvas {
  position: fixed;
  top: 10px;
  left: 10px;
  border: 1px solid #ccc;
}

.tools {
  position: fixed;
  top: 30px;
  right: 10px;
  user-select: none;
}

.tools button {
  display: block;
  margin-bottom: 10px;
}
</style>
