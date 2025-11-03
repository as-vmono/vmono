<template>
  <section class="demo-section">
    <span class="demo-section-desc">默认自动补丁未匹配到的 value</span>
    <MultiPicker v-model="pickerValue" :options="options" :field-names="fieldNames">
      <template #trigger="{ triggerPopupShow, showValue }">
        <div class="trigger-box">
          <van-button type="primary" @click="triggerPopupShow"> trigger </van-button>
          <p>show value: {{ showValue }}</p>
          <p>modelValue: {{ pickerValue }}</p>
        </div>
      </template>
    </MultiPicker>
  </section>

  <section class="demo-section">
    <span class="demo-section-desc">自定义补丁规则</span>
    <MultiPicker
      v-model="pickerValue"
      :options="options"
      :field-names="fieldNames"
      :processing-fallback-opts="processingFallbackOpts"
    >
      <template #trigger="{ triggerPopupShow, showValue }">
        <div class="trigger-box">
          <van-button type="primary" @click="triggerPopupShow"> trigger </van-button>
          <p>show value: {{ showValue }}</p>
          <p>modelValue: {{ pickerValue }}</p>
        </div>
      </template>
    </MultiPicker>
  </section>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { MultiPicker, TMPProcessingFallbackOptsPayload } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const options = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2', disabled: true },
  { name: '选项3', value: '3' },
];

const defaultSelectedOptions = [options?.[2], { name: '选项4', value: '4' }];

const fieldNames = {
  label: 'name',
  value: 'value',
};
const [pickerValue, _setPickerValue] = useWrapperRef<string[]>(defaultSelectedOptions.map((item) => item.value));

const processingFallbackOpts = (p: TMPProcessingFallbackOptsPayload) => {
  const { prePathValues } = p;
  return prePathValues.map((value) => {
    const matchedOption = defaultSelectedOptions.find((item) => item.value === value);
    if (matchedOption) {
      return {
        [fieldNames.label]: matchedOption.name,
        [fieldNames.value]: matchedOption.value,
      };
    }
    return {
      [fieldNames.label]: value,
      [fieldNames.value]: value,
    };
  });
};
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
