<script setup lang="ts" name="App">
import { ref, watchEffect, watch, compile, computed } from 'vue';
import GithubCorner from '@/components/GithubCorner.vue';
import Slider from '@/components/Slider.vue';
import EmojiPicker from '@/components/EmojiPicker.vue';
import notFoundImage from '@/assets/not-found.png';
import { emojis, emojisMix } from '@/emojis';
import { getMixedEmojiUrl } from '@/utils';

const emoji1 = ref('');
const emoji2 = ref('');
const loading = ref(false);

// 初始化
const [_, e1, e2] = /^#([\d\w]{5})_([\d\w]{5})$/g.exec(location.hash) ?? [];
if (e1 && e2 && emojis.includes(e1) && emojis.includes(e2)) {
  emoji1.value = e1;
  emoji2.value = e2;
} else {
  emoji1.value = emojis[2];
  emoji2.value = emojis[2];
}

const isMixExist = (e1: string, e2: string) => {
  const index = emojis.indexOf(e2);
  return emojisMix[e1].includes(index);
}

// 获取url
const url = ref('');
watchEffect(() => {
  const e1 = emoji1.value;
  const e2 = emoji2.value;
  location.hash = `${e1}_${e2}`;
  if (isMixExist(e1, e2)) {
    url.value = getMixedEmojiUrl(e1, e2);
  } else if (isMixExist(e2, e1)) {
    url.value = getMixedEmojiUrl(e2, e1);
  } else {
    url.value = notFoundImage;
  }
});
const alt = computed(() => {
  return url.value === notFoundImage ? 'image not found' : location.hash.slice(1);
});

watch(url, () => {
  loading.value = true;
});

// 加载完成
const onLoad = () => {
  loading.value = false;
};

// 加载错误
const onError = (e: Event) => {
  loading.value = false;
  e.preventDefault();
  e.stopPropagation();
  return false;
};

// 乱序
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
    <div class="silder-container">
      <Slider key="slider1" v-model:value="emoji1" />
      <button class="btn" @click="onSelect(1)">pick</button>
    </div>
    <span class="icon">+</span>
    <div class="silder-container">
      <Slider key="slider2" v-model:value="emoji2" />
      <button class="btn" @click="onSelect(2)">pick</button>
    </div>
    <span class="icon">=</span>
    <div class="mix-image">
      <img v-show="!loading" class="emojimix-image" :alt="alt" :src="url" @error="onError" @load="onLoad"
        @click="shuffle" />
      <span v-show="loading">loading...</span>
    </div>
  </main>
  <footer class="app-footer">
    <button class="btn" @click="shuffle">shuffle</button>
  </footer>
  <EmojiPicker v-model:visible="visible" :select="select" @pick="onPick" />
</template>

<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
  user-select: none;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120px;
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

  .mix-image {
    width: 4em;
  }

  .emojimix-image {
    display: inline-block;
    width: 4em;
    height: 4em;
    cursor: pointer;
  }

  .silder-container {
    .btn {
      margin-block-start: 8px;
    }
  }
}

.app-footer {
  margin-block-start: 24px;
  text-align: left;

  .btn {
    background-color: darkorange;
  }
}

.btn {
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  background-color: bisque;
}
</style>
