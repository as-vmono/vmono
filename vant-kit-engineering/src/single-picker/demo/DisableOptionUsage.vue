<template>
  <SinglePicker
    v-model="pickerValue"
    :picker-props="{
      title,
      columns: columns,
      columnsFieldNames: columnsFieldNames,
    }"
    @confirm-disabled-option="({}) => showToast('你可以自定义后续操作,回调函数参数类型 TConfirmDisabledOptionPayload')"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <span>
          <van-button @click="showPartialDisableOptions(triggerPopupShow)"> 部分选项禁用 </van-button>
          <van-button @click="showAllDisableOptions(triggerPopupShow)"> 全部选项禁用 </van-button>
        </span>
        <p>show value: {{ showValue }}</p>
        <p>modelValue: {{ pickerValue }}</p>
      </div>
    </template>
  </SinglePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import SinglePicker from '../index.vue';
import { showToast, Button as VanButton } from 'vant';

const partialDisableCols = [
  { name: '选项1', value: '1' },
  { name: '选项2(禁用)', value: '2', disabled: true },
  { name: '选项3', value: '3' },
];
const allDisableCols = [
  { name: '选项1(禁用)', value: '1(禁用)', disabled: true },
  { name: '选项2(禁用)', value: '2(禁用)', disabled: true },
  { name: '选项3(禁用)', value: '3(禁用)', disabled: true },
];
const [columns, setColumns] = useWrapperRef(partialDisableCols);
const columnsFieldNames = {
  text: 'name',
  value: 'value',
};
const [pickerValue, _setPickerValue] = useWrapperRef<string | undefined>(undefined);

const [title, setTitle] = useWrapperRef<string>('');
const showPartialDisableOptions = (triggerPopupShow) => {
  setTitle('部分选项禁用');
  setColumns(partialDisableCols);
  triggerPopupShow();
};
const showAllDisableOptions = (triggerPopupShow) => {
  setTitle('全部选项禁用');
  setColumns(allDisableCols);
  triggerPopupShow();
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
