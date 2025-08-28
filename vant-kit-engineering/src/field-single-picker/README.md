# FieldSinglePicker

### 介绍

基于 SinglePicker 以及 vant 的 field 组件进行二次封装，方便处理表单中的单项选择需求场景。

- 支持传入所有 SinglePicker props（类型 TSinglePickerProps）
- 支持传入所有的 [vant field props](https://vant-ui.github.io/vant/#/zh-CN/field#props)

**主要功能描述**

- 集成 SinglePicker 所有功能

**对开发者的解脱**

- 符合 ui 设计
- 默认场景下 van-field 绑定值就是展示值，FieldSinglePicker 内部将绑定值与展示值表单真正需要收集的值分隔开。

## 代码演示

### 基础用法

```html
<template>
  modelValue: {{ pickerValue }}
  <FieldSinglePicker
    v-model="pickerValue"
    :field-props="{
      name: 'declarationType',
      label: '单选',
      placeholder: '请选择',
      required: true,
      rules: [{ required: true, message: '请选择' }],
    }"
    :picker-props="{
      title: '基础用法',
      columns: columns,
      columnsFieldNames: columnsFieldNames,
    }"
  >
    <template #columns-top>
      <div class="desc">这就是基础组件 - SinglePicker</div>
    </template>
  </FieldSinglePicker>
</template>

<script setup lang="ts">
  import { useWrapperRef } from '@vmono/vhooks';
  import { FieldSinglePicker } from '@vmono/vant-kit';

  const columns = [
    { name: '选项1', value: '1' },
    { name: '选项2', value: '2' },
  ];
  const columnsFieldNames = {
    text: 'name',
    value: 'value',
  };
  const [pickerValue, _setPickerValue] = useWrapperRef<string | undefined>(
    undefined,
  );
</script>

<style scoped lang="less">
  .desc {
    font-size: 12px;
    text-align: center;
  }
</style>
```

## API

### Props

继承 TSinglePickerProps 的同时

| 参数       | 说明               | 类型             | 默认值 |
| ---------- | ------------------ | ---------------- | ------ |
| fieldProps | 当前选中项对应的值 | vant field props | -      |

### Events

继承 SinglePicker

| 事件名 | 说明 | 回调参数 |
| :----- | :--- | :------- |
| -      | -    | -        |

### Slots

继承 SinglePicker

| 名称 | 说明 | 参数 |
| :--- | :--- | :--- |
| -    | -    | -    |
