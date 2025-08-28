# FieldMultiPicker

### 介绍

基于 MultiPicker 以及 vant 的 field 组件进行二次封装，方便处理表单中的单项选择需求场景。

- 支持传入所有 MultiPicker props（类型 TMultiPickerProps）
- 支持传入所有的 [vant field props](https://vant-ui.github.io/vant/#/zh-CN/field#props)

**主要功能描述**

- 集成 MultiPicker 所有功能

**对开发者的解脱**

- 符合 ui 设计
- 默认场景下 van-field 绑定值就是展示值，FieldMultiPicker 内部将绑定值与展示值表单真正需要收集的值分隔开。

## 代码演示

### 基础用法

```html
<template>
  <span @click="getIdMapData">modelValue: {{ pickerValue }}</span>
  <FieldMultiPicker
    ref="FieldMultiPickerRef"
    v-model="pickerValue"
    :options="options"
    :field-names="fieldNames"
    title="基础用法"
    tip-txt="这就是基础组件 - MultiPicke"
    :field-props="{
      name: 'fieldName',
      label: '多选',
      placeholder: '请选择',
      required: true,
      rules: [{ required: true, message: '请选择' }],
    }"
  />
</template>

<script setup lang="ts">
  import { useWrapperRef } from '@vmono/vhooks';
  import { FieldMultiPicker } from '@vmono/vant-kit';
  import { ref } from 'vue';

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

  const FieldMultiPickerRef = ref<InstanceType<typeof FieldMultiPicker>>();
  const getIdMapData = () => {
    console.log(
      'getIdMapData',
      FieldMultiPickerRef.value?.getOptionsIdMapData?.(),
    );
  };
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

继承 TMultiPickerProps 的同时

| 参数       | 说明               | 类型             | 默认值 |
| ---------- | ------------------ | ---------------- | ------ |
| fieldProps | 当前选中项对应的值 | vant field props | -      |

### Events

继承 MultiPicker

| 事件名 | 说明 | 回调参数 |
| :----- | :--- | :------- |
| -      | -    | -        |

### Slots

继承 MultiPicker

| 名称 | 说明 | 参数 |
| :--- | :--- | :--- |
| -    | -    | -    |
