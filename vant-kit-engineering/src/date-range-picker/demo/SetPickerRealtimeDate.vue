<template>
  <DateRangePicker
    ref="DateRangePickerRef"
    v-model="modelValue"
    :picker-group-props="{ title: '设置 picker 默认选中项' }"
  >
    <template #trigger="{ triggerPopupShow, pickerRealtimeOptions, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <p>picker 实时选中值👇</p>
        <p>{{ pickerRealtimeOptions }}</p>
        <p>(modelValue 有值，则以 modelValue 为准)</p>
        <van-space>
          <van-button type="primary" @click="triggerPopupShow"> trigger </van-button>
          <van-button
            type="warning"
            @click="
              () =>
                DateRangePickerRef?.setPickerRealtimeDate({
                  start: '2022-02-02',
                  end: '2033-03-03',
                })
            "
          >
            2022-02-02 ~ 2033-03-03
          </van-button>
        </van-space>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { ref } from 'vue';
import { Button as VanButton, Space as VanSpace } from 'vant';

const DateRangePickerRef = ref<InstanceType<typeof DateRangePicker>>();

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
