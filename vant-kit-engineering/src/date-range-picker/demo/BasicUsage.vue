<template>
  <DateRangePicker v-model="modelValue" :picker-group-props="{ title: '基础用法' }">
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value: {{ modelValue }}</p>
        <p>showValue: {{ showValue }}</p>
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
