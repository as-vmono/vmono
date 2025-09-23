<template>
  <DatePicker v-model="modelValue" :picker-props="{ title: '基础用法' }">
    <template #trigger="{ triggerPopupShow }">
      <div class="trigger-box">
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
    <template #columns-top>
      <div class="columns-top-bar">
        <span>这里是 columns-top 插槽内容</span>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DatePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef('');
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.columns-top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
