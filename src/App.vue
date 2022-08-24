<script setup lang="ts" name="App">
/*
  [] support mobile、ipad、pc
  [] copy(https+cors)
  [] animation
  [] 暗黑模式
  [] google ga
  [] a11y
  [] pwa
  [] 爬虫爬取图片，省去加载地事件
*/
import { computed, ref, watchEffect } from 'vue';
import GithubCorner from '@/components/GithubCorner.vue';
import Slider from '@/components/Slider.vue';
import EmojiPicker from '@/components/EmojiPicker.vue';
import notFoundImage from '@/assets/not-found.png';
import { emojis } from '@/emojis';
import { getMixedEmojiUrl } from '@/utils';

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

// 获取 emojimix 图片的url
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

// 图片加载错误处理
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

// 洗牌
const shuffle = () => {
  const randomIndex1 = Math.floor(emojis.length * Math.random());
  const randomIndex2 = Math.floor(emojis.length * Math.random());
  emoji1.value = emojis[randomIndex1];
  emoji2.value = emojis[randomIndex2];
};

// emoji 选择弹窗
const visible = ref(false);
const select = ref('');
let pickType = 1;
const onPick = (value: string) => {
  if (pickType === 1) {
    emoji1.value = value;
  } else {
    emoji2.value = value;
  }
};
const onSelect = (type: number) => {
  pickType = type;
  visible.value = true;
  if (pickType === 1) {
    select.value = emoji1.value;
  } else {
    select.value = emoji2.value;
  }
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
    <img v-if="url" class="emojimix-image" alt="emojimix" :src="url" @error="onError" @click="shuffle" />
    <span v-if="isNotFound">not found image</span>
  </main>
  <button @click="shuffle"> shuffle </button>
  <button @click="onSelect(1)"> select1 </button>
  <button @click="onSelect(2)"> select2 </button>
  <EmojiPicker v-model:visible="visible" :select="select" @pick="onPick" />
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

  .emojimix-image {
    display: inline-block;
    width: 4em;
    height: 4em;
    cursor: pointer;
  }
}
</style>
