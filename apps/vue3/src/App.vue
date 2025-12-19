<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import DrawingBoard from './components/DrawingBoard/index.vue';
import LinkDot from './components/LinkDot/index.vue';
import DrawTree from './components/DrawTree/index.vue';
import Flip from './components/Flip/index.vue';
import MusicPlayer from './components/MusicPlayer/index.vue';
import PerformTask from './components/PerformTask/index.vue';

import { HelloWorld } from '@wupup/components';

// import { uploadLargeFile } from '@wupup/utils-web';

// const onInputChange = e => {
//   const file = e.target.files[0];
//   uploadLargeFile(file, 1);
// };
</script>

<template>
  <LinkDot />

  <div>
    <input type="file" @change="onInputChange" />
  </div>
</template>

<style>
body,
html,
p,
h1,
h2,
h3 {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* width: 100vw;
  height: 100vh;
  overflow: hidden; */
}
</style>
