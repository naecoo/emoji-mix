<script setup lang="ts" name="App">
/*
  todo: https://tikolu.net/emojimix
  [] 暗黑模式
  [] PWA
  [] copy
  [] view board
  [] random pick
  [] support mobile、ipad、pc
  [] animation
  [] url query
  [] google ga
  [] a11y
*/
import { computed, ref, watchEffect } from 'vue';
import GithubCorner from '@/components/GithubCorner.vue';
import Slider from '@/components/Slider.vue';
import { emojis } from '@/emojis';
import notFoundImage from '@/assets/not-found.png';

const getMixedEmojiUrl = (x: string, y: string) => `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${x}/u${x}_u${y}.png`;

const emoji1 = ref('');
const emoji2 = ref('');

// get initinal value
const [_, e1, e2] = /^#([\d\w]{5})_([\d\w]{5})$/g.exec(location.hash) ?? [];
if (e1 && e2 && emojis.includes(e1) && emojis.includes(e2)) {
  emoji1.value = e1;
  emoji2.value = e2;
} else {
  emoji1.value = emojis[2];
  emoji2.value = emojis[2];
}

const url = ref('');
const alternativeUrl = ref('');
const isNotFound = computed(() => url.value === notFoundImage);
let count = 0;
watchEffect(() => {
  count++;
  location.hash = `${emoji1.value}_${emoji2.value}`;
  url.value = getMixedEmojiUrl(emoji1.value, emoji2.value);
  alternativeUrl.value = getMixedEmojiUrl(emoji2.value, emoji1.value);
});

const onError = (e: Event) => {
  if (url.value !== alternativeUrl.value) {
    url.value = alternativeUrl.value;
  } else {
    url.value = notFoundImage
  }
  e.preventDefault();
  e.stopPropagation();
  return false;
};

const shuffle = () => {
  const randomIndex1 = Math.floor(emojis.length * Math.random());
  const randomIndex2 = Math.floor(emojis.length * Math.random());
  emoji1.value = emojis[randomIndex1];
  emoji2.value = emojis[randomIndex2];
};
</script>

<template>
  <header class="app-header">
    <GithubCorner />
  </header>
  <main class="app-main">
    <Slider key="slider1" v-model:value="emoji1" />
    <span class="icon">+</span>
    <Slider key="slider2" v-model:value="emoji2" />
    <span class="icon">=</span>
    <img v-if="url" :src="url"  alt="emojimix" class="result" @error="onError" />
    <span v-if="isNotFound">not found image</span>
  </main>
  <footer>
    <button @click="shuffle">shuffle</button>
  </footer>
</template>

<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
}
.app-main {
  display: flex;
  align-items: center;
  .icon {
    display: inline-block;
    font-size: 2em;
    margin: 0 1em;
    transform: translateY(-0.3em);
  }
  .result {
    display: inline-block;
    width: 4em;
    height: 4em;
  }
}
</style>
