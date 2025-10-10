<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { lrc as lrcStr } from './yhfg.js';

function parseLrc(lrc: string, offset = 0): { time: number; text: string }[] {
  const lines = lrc.split('\n');
  const pattern = /\[(\d+):(\d+)\.(\d+)]/g;
  const result: { time: number; text: string }[] = [];

  for (const line of lines) {
    let matches;
    const texts = line.replace(pattern, '').trim();

    while ((matches = pattern.exec(line)) !== null) {
      const min = parseInt(matches[1], 10);
      const sec = parseInt(matches[2], 10);
      const ms = parseInt(matches[3], 10);
      const time = min * 60 * 1000 + sec * 1000 + (ms < 100 ? ms * 10 : ms) + offset * 1000;
      result.push({ time, text: texts });
    }
  }

  result.sort((a, b) => a.time - b.time);
  return result;
}

const lrcList = ref<{ time: number; text: string }[]>([]);
lrcList.value = parseLrc(lrcStr, -13);

function getLrcIndexByTime(time: number): number {
  for (let i = 0; i < lrcList.value.length; i++) {
    if (time < lrcList.value[i].time) {
      return i - 1;
    }
  }
  return lrcList.value.length - 1;
}

function init() {
  const audioDom = document.querySelector('.audio') as HTMLAudioElement;
  const lrcWrap = document.querySelector('.lrc-wrap') as HTMLElement;
  const lrcUl = document.querySelector('.lrc-list') as HTMLElement;
  const lrcItems = document.querySelectorAll('.lrc-item') as NodeListOf<HTMLElement>;

  const wrapHeight = lrcWrap.clientHeight;
  const itemHeight = lrcItems[0].clientHeight;

  audioDom.addEventListener('loadedmetadata', () => {
    console.log('🚩 🥕 :50 🥕 loadedmetadata 🥕 audioDom.duration=>', audioDom.duration);
  });

  audioDom.addEventListener('timeupdate', () => {
    const currentLrcItem = document.querySelector('.lrc-item.active');
    currentLrcItem && currentLrcItem.classList.remove('active');

    const currentTime = audioDom.currentTime * 1000;
    const index = getLrcIndexByTime(currentTime);
    if (index === -1) return;

    const currentItem = lrcItems[index] as HTMLElement;
    currentItem.classList.add('active');
    let offsetTop = currentItem.offsetTop - wrapHeight / 2 + itemHeight / 2;
    if (offsetTop < 0) offsetTop = 0;
    lrcUl.style.transform = `translateY(-${offsetTop}px)`;
  });
}

onMounted(() => {
  init();
});
</script>

<template>
  <div class="music-player">
    <div class="lrc-wrap">
      <div class="mask-top"></div>
      <ul class="lrc-list">
        <li class="lrc-item" v-for="(item, i) in lrcList" :key="i">{{ item.text }}</li>
      </ul>
      <div class="mask-bottom"></div>
    </div>

    <div class="audio-wrap">
      <audio class="audio" ref="audioRef" src="/mp3/圆9 - 萤火飞光.mp3" controls></audio>
    </div>
  </div>
</template>

<style scoped>
.music-player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
}

.lrc-wrap {
  --p: 180px;
  width: 100%;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  /* overflow-y: auto; */
  position: relative;
}

.lrc-wrap::-webkit-scrollbar {
  width: 1px;
}

.mask-top {
  width: 100%;
  height: var(--p);
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  z-index: 999;
  pointer-events: none;
}

.mask-bottom {
  width: 100%;
  height: var(--p);
  position: fixed;
  bottom: 60px;
  left: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
  z-index: 999;
  pointer-events: none;
}

.lrc-list {
  box-sizing: border-box;
  list-style: none;
  padding: 30px;
  margin: 30px;
  color: #999;
  font-size: 18px;
  font-weight: 600;
  transition: transform 0.6s;
}

.lrc-item {
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.lrc-item.active {
  color: #fff;
  transform: scale(1.5);
  transition: all 0.3s;
}

.audio-wrap {
  width: 100%;
  flex: 0 0 60px;
  background: rgba(205, 66, 255, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.audio {
  width: 90%;
  height: 45px;
}
</style>
