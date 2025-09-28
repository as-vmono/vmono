<template>
  <DateRangePicker
    v-model="modelValue"
    :show-value-formatter="
      ({ startDate, endDate }) => {
        if (startDate && endDate) {
          return dayjs(startDate).format('YY年MM月DD日') + ' / ' + dayjs(endDate).format('YY年MM月DD日');
        }
      }
    "
    :picker-group-props="{ title: '格式化展示值' }"
    @confirm="
      (p) => {
        showToast(`dayjs(date).format('YY年MM月DD日'))`);
        console.log(p);
      }
    "
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value: {{ modelValue }}</p>
        <p>showValue: {{ showValue }}</p>
        <van-button type="primary" @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { Button as VanButton, showToast } from 'vant';
import dayjs from 'dayjs';

const [modelValue] = useWrapperRef<[string, string]>(['2020-03-04', '2030-05-06']);
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
