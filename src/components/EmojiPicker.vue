<script setup lang="ts">
import { emojis } from '@/emojis';
import { getEmojiUrl } from '@/utils';

const props = defineProps<{
  visible: boolean;
  select: string;
}>();

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'pick', value: string): void;
}>();

const onPick = (value: string) => {
  emit('pick', value);
  emit('update:visible', false);
}

// todo: 动画和UI优化
</script>

<template>
  <div v-show="props.visible" class="emoji-grid-shadow" @click.self="emit('update:visible', false)">
    <div class="emoji-grid">
      <img class="emoji-image" v-for="emoji in emojis" :key="emoji" :class="{ 'is-select': props.select === emoji }"
        :src="getEmojiUrl(emoji)" :alt="`emoji-u${emoji}`" @click="onPick(emoji)" />
    </div>
  </div>
</template>

<style lang="less">
@size: 3em;

.emoji-grid-shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
}

.emoji-grid {
  position: absolute;
  top: 5em;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(auto-fill, @size);
  grid-gap: 1em;
  width: 50vw;
  height: 60vh;
  padding: 1em;
  border-radius: 4px;
  overflow-y: scroll;
  background: sandybrown;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }

  .emoji-image {
    display: inline-block;
    width: @size;
    height: @size;
    cursor: pointer;

    &.is-select {
      outline: 2px solid red;
    }
  }
}
</style>
