<template>
  <DatePicker ref="DatePickerRef" v-model="modelValue" :picker-props="{ title: '设置 picker 默认选中项' }">
    <template #trigger="{ triggerPopupShow, pickerRealtimeOptions, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <p>picker 实时选中值:{{ pickerRealtimeOptions }}</p>
        <p>(modelValue 有值，则以 modelValue 为准)</p>
        <van-space>
          <van-button type="primary" @click="triggerPopupShow"> trigger </van-button>
          <van-button type="warning" @click="() => DatePickerRef?.setPickerRealtimeDate('2035-05-06')">
            2035-05-06
          </van-button>
        </van-space>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DatePicker } from '@vmono/vant-kit';
import { ref } from 'vue';
import { Button as VanButton, Space as VanSpace } from 'vant';

const [modelValue] = useWrapperRef('2030-03-04');
const DatePickerRef = ref<InstanceType<typeof DatePicker>>();
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
