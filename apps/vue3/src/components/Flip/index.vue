<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import Flip from './Flip';

let flipInstances, list, items;

function init() {
  list = document.querySelector('.list');
  items = Array.from(list.childNodes);
  flipInstances = new Flip(items, 0.5);
  console.log('flipInstances =>> ', flipInstances);
}

function shuffle() {
  items.sort(() => Math.random() - 0.5);
  list.innerHTML = '';
  items.forEach(item => list.appendChild(item));

  // list.insertBefore(
  //   list.firstElementChild, null
  // );

  flipInstances.play();

  console.log('flipInstances =>> ', flipInstances);
}

onMounted(() => {
  init();
});
</script>

<template>
  <div class="flip">
    <button @click="shuffle">Flip动画</button>
    <ul class="list">
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
    </ul>
  </div>
</template>

<style scoped>
.list li {
  width: 200px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  margin-bottom: 10px;
  border: 1px solid #000;
  background-color: hotpink;
}
</style>
