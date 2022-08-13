<script setup lang="ts" name="Slider">
import { nextTick, reactive, ref, watch } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import type { Options as SplideOptions } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import { emojis } from '@/emojis';
import { getEmojiUrl } from '@/utils';

const props = defineProps<{
  value: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', id: string): void;
}>();

const splide = ref<InstanceType<typeof Splide>>();

const start = emojis.findIndex(emoji => emoji === props.value)
const splideOptions: SplideOptions = reactive({
  type: 'loop',
  direction: 'ttb',
  height: '10em',
  perPage: 3,
  lazyLoad: 'nearby',
  pagination: false,
  arrows: false,
  focus: 'center',
  wheel: true,
  start: start === 0 ? emojis.length : start,
});

let lock = false;
const onMove = (el: any, curr: number) => {
  if (lock) return;

  const id = curr === emojis.length ? emojis[0] : emojis[curr];
  emit('update:value', id);
};

watch(() => props.value, (val) => {
  const index = emojis.findIndex(emoji => emoji === val);

  splide.value?.go(index === 0 ? emojis.length : index);

  lock = true;
  nextTick(() => {
    lock = false;
  });
});

</script>

<template>
  <Splide ref="splide" :options="splideOptions" @splide:move="onMove">
    <SplideSlide v-for="id in emojis" :key="id">
      <img
        class="slider-image"
        :src="getEmojiUrl(id)"
        :alt="`emoji-u${id}`"
      />
    </SplideSlide>
  </Splide>
</template>

<style lang="less">
.slider-image {
  display: inline-block;
  width: 2.5em;
  height: 2.5em;
}
</style>
