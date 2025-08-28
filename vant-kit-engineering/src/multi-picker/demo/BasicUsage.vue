<template>
  <MultiPicker
    v-model="pickerValue"
    :options="options"
    :field-names="fieldNames"
    title="基础用法"
    tip-txt="💫这是一段提示文本: 你可以根据业务需要自行定制展示的内容"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <van-button type="primary" @click="triggerPopupShow"> 点击打开多选-选择器🤪 </van-button>
        <p>show value: {{ showValue }}</p>
        <p>modelValue: {{ pickerValue }}</p>
      </div>
    </template>
  </MultiPicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import MultiPicker from '../index.vue';
import { Button as VanButton } from 'vant';

const options = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2', disabled: true },
  { name: '选项3', value: '3' },
];
const fieldNames = {
  label: 'name',
  value: 'value',
};
const [pickerValue, _setPickerValue] = useWrapperRef<string[]>([]);
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
