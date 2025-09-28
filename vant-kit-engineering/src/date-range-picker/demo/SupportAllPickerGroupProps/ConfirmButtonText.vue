<template>
  <DateRangePicker
    v-model="modelValue"
    :picker-group-props="{
      title: '设置 confirmButtonText',
      confirmButtonText: '👉✅👈',
    }"
  >
    <template #trigger="{ triggerPopupShow }">
      <div class="trigger-box">
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef<[string, string]>(['', '']);
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
