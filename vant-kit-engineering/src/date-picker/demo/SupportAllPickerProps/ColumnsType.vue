<template>
  <DatePicker v-model="modelValue" :picker-props="{ title: '基础用法', columnsType: ['month', 'day'] }">
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <van-button @click="triggerPopupShow"> trigger </van-button>
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
</style>
