<template>
  <div class="test-cpn-wrapper">
    <p>这是 cpn1.md 外部的 Test vue cpn</p>

    <section>
      <p>👇下面引入了工具包的组件 cpn-kit</p>
      <ShowAvatar name="阿顺" />
      <SinglePicker
        v-model="pickerValue"
        :picker-props="{
          title: '基础用法',
          columns: columns,
          columnsFieldNames: columnsFieldNames,
        }"
        show-search
        @search="onSearch"
      >
        <template #trigger="{ triggerPopupShow, showValue }">
          <div class="trigger-box">
            <p @click="triggerPopupShow">点击打开选择器🤪</p>
            <span>show value: {{ showValue }}</span>
            <span>modelValue: {{ pickerValue }}</span>
          </div>
        </template>
      </SinglePicker>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ShowAvatar, SinglePicker } from '@vmono/cpn-kit';
import { useWrapperRef } from '@vmono/vhooks';
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
.test-cpn-wrapper {
  padding: 12px;
  border: 1px solid;
  border-radius: 6px;

  section {
    padding: 20px;
    border: 1px solid skyblue;
    border-radius: 6px;

    .trigger-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        padding: 8px;
        cursor: pointer;
        border-radius: 5px;
        color: #fff;
        background-color: #1989fa;
      }
    }
  }
}
</style>
