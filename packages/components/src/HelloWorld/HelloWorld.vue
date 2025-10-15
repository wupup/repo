<script setup lang="ts">
import { onBeforeUnmount, onUnmounted, ref } from 'vue';

import { formatDate } from '@wupup/utils';

defineOptions({ name: 'HelloWorld' });

// interface Props {
//   msg?: string
// }

// withDefaults(defineProps<Props>(), {
//   msg: 'Hello World'
// })

defineProps({
  msg: {
    type: String,
    default: 'Hello World',
  },
});

const date = ref('');

(() => {
  const timer = setInterval(() => {
    date.value = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
  }, 100);

  onBeforeUnmount(() => {
    clearInterval(timer);
  });
})();
</script>

<template>
  <div class="hello-world">
    <span class="red" data-testid="n1">{{ msg }} </span>
    <span>{{ date }} </span>
  </div>
</template>

<style lang="scss" scoped>
$color-red: #f30;

.red {
  color: $color-red;
  transform: color 0.2s;
}
</style>
