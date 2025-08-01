<template>
  <SinglePicker
    v-model="pickerValue"
    :picker-props="{
      title: '基础用法',
      columns: columns,
      columnsFieldNames: columnsFieldNames,
    }"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <van-button type="primary" @click="triggerPopupShow"> 点击打开选择器🤪 </van-button>
        <p>show value: {{ showValue }}</p>
        <p>modelValue: {{ pickerValue }}</p>
      </div>
    </template>
  </SinglePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import SinglePicker from '../index.vue';
import { Button as VanButton } from 'vant';

const columns = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2' },
];
const columnsFieldNames = {
  text: 'name',
  value: 'value',
};
const [pickerValue, _setPickerValue] = useWrapperRef<string | undefined>(undefined);
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
