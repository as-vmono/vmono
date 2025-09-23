<template>
  <DatePicker
    v-model="modelValue"
    :show-value-formatter="(date) => dayjs(date).format('YY年MM月DD日')"
    :picker-props="{ title: '格式化展示值' }"
    @confirm="
      (p) => {
        showToast(`dayjs(date).format('YY年MM月DD日'))`);
        console.log(p);
      }
    "
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <van-button type="primary" @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DatePicker } from '@vmono/vant-kit';
import { Button as VanButton, showToast } from 'vant';
import dayjs from 'dayjs';

const [modelValue] = useWrapperRef('2030-03-04');
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
