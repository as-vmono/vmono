<template>
  <section class="demo-section">
    <span class="demo-section-desc">默认自动补丁未匹配到的 value</span>
    <SinglePicker
      v-model="pickerValue"
      :picker-props="{
        title: 'fallbackShowValue',
        columns: columns,
        columnsFieldNames: columnsFieldNames,
      }"
    >
      <template #trigger="{ triggerPopupShow, showValue }">
        <div class="trigger-box">
          <van-button type="primary" @click="triggerPopupShow"> trigger </van-button>
          <p>show value: {{ showValue }}</p>
          <p>modelValue: {{ pickerValue }}</p>
        </div>
      </template>
    </SinglePicker>
  </section>

  <section class="demo-section">
    <span class="demo-section-desc">自定义补丁规则</span>
    <SinglePicker
      v-model="pickerValue"
      :picker-props="{
        title: 'fallbackShowValue',
        columns: columns,
        columnsFieldNames: columnsFieldNames,
      }"
      :processing-fallback-opt="processingFallbackOpt"
      show-search
      @search="onSearch"
    >
      <template #trigger="{ triggerPopupShow, showValue }">
        <div class="trigger-box">
          <van-button type="primary" @click="triggerPopupShow"> trigger </van-button>
          <p>show value: {{ showValue }}</p>
          <p>modelValue: {{ pickerValue }}</p>
        </div>
      </template>
    </SinglePicker>
  </section>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { SinglePicker, TSPProcessingFallbackOptPayload } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';
import { checkStrIsEmpty } from '@vmono/utils';

const defaultSelectedOptions = { name: '选项3', value: '3' };

const columnsDataSource = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2' },
];
const [columns, setColumns] = useWrapperRef(columnsDataSource);
const columnsFieldNames = {
  text: 'name',
  value: 'value',
};

const [pickerValue, _setPickerValue] = useWrapperRef<string | undefined>(defaultSelectedOptions.value);

const processingFallbackOpt = (p: TSPProcessingFallbackOptPayload) => {
  const { prePathValue } = p;
  if (prePathValue == defaultSelectedOptions.value) {
    return {
      [columnsFieldNames.text]: defaultSelectedOptions.name,
      [columnsFieldNames.value]: defaultSelectedOptions.value,
    };
  }
  return {
    [columnsFieldNames.text]: prePathValue,
    [columnsFieldNames.value]: prePathValue,
  };
};

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
