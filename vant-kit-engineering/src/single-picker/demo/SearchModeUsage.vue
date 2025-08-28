<template>
  <SinglePicker
    v-model="pickerValue"
    :picker-props="{
      columns: columns,
      columnsFieldNames: columnsFieldNames,
    }"
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

    <template #title>Ashun</template>
  </SinglePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { SinglePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';
import { checkStrIsEmpty } from '@vmono/utils';

const columnsDataSource = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2' },
];
const [columns, setColumns] = useWrapperRef(columnsDataSource);
const columnsFieldNames = {
  text: 'name',
  value: 'value',
};
const [pickerValue, _setPickerValue] = useWrapperRef<string | undefined>(undefined);

const onSearch = (keywords: string) => {
  if (checkStrIsEmpty(keywords)) {
    setColumns(columnsDataSource);
  } else {
    setColumns(
      columnsDataSource.filter((item) => item.name.toLocaleLowerCase().includes(keywords.toLocaleLowerCase()))
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
