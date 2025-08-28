<template>
  <MultiPicker
    v-model="pickerValue"
    :options="options"
    :field-names="fieldNames"
    title="基础用法"
    show-search
    @search="onSearch"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <van-button type="primary" @click="triggerPopupShow"> 带搜索框🔍 </van-button>
        <p>show value: {{ showValue }}</p>
        <p>modelValue: {{ pickerValue }}</p>
      </div>
    </template>
  </MultiPicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { MultiPicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';
import { checkStrIsEmpty } from '@vmono/utils';

const optionsDataSource = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2', disabled: true },
  { name: '选项3', value: '3' },
  { name: '选项4', value: '4', disabled: true },
  { name: '选项5', value: '5' },
  { name: '选项6', value: '6' },
  { name: '选项7', value: '7', disabled: true },
  { name: '选项8', value: '8' },
  { name: '选项9', value: '9' },
  { name: '选项10', value: '10' },
  { name: '选项11', value: '11', disabled: true },
  { name: '选项12', value: '12' },
  { name: '选项13', value: '13', disabled: true },
  { name: '选项14', value: '14' },
  { name: '选项15', value: '15' },
  { name: '选项16', value: '16', disabled: true },
  { name: '选项17', value: '17' },
  { name: '选项18', value: '18' },
  { name: '选项19', value: '19' },
  { name: '选项20', value: '20' },
];
const [options, setOptions] = useWrapperRef(optionsDataSource);

const fieldNames = {
  label: 'name',
  value: 'value',
};
const [pickerValue, _setPickerValue] = useWrapperRef<string[]>([]);

const onSearch = (keywords: string) => {
  if (checkStrIsEmpty(keywords)) {
    setOptions(optionsDataSource);
  } else {
    setOptions(
      optionsDataSource.filter((item) => item.name.toLocaleLowerCase().includes(keywords.toLocaleLowerCase()))
    );
  }
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
