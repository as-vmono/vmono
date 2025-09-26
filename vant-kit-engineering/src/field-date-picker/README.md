# FieldDatePicker

### 介绍

基于 DatePicker 以及 vant 的 field 组件进行二次封装，方便处理表单中的时间选择需求场景。

- 支持传入所有 DatePicker props（类型 TDatePickerProps）
- 支持传入所有的 [vant field props](https://vant-ui.github.io/vant/#/zh-CN/field#props)

**主要功能描述**

- 集成 DatePicker 所有功能

**对开发者的解脱**

- 符合 ui 设计
- 默认场景下 van-field 绑定值就是展示值，FieldDatePicker 内部将绑定值与展示值表单真正需要收集的值分隔开。

## 代码演示

### 基础用法

```html
<template>
  <van-form
    ref="FormRef"
    :validate-trigger="['onBlur', 'onChange', 'onSubmit']"
  >
    <p>modelValue:{{ modelValue }}</p>
    <FieldDatePicker
      ref="FieldDatePickerRef"
      v-model="modelValue"
      :field-props="{
        name: 'dateField',
        label: 'FieldDatePicker',
        labelWidth: '12.5rem',
        readonly: false,
        required: true,
        rules: [{ required: true, message: '请选择' }],
      }"
      :show-value-formatter="(date) => date?.toLocaleDateString()"
      :picker-props="{ title: '选择' }"
    >
      <template #columns-top>Ashutefannao</template>
    </FieldDatePicker>

    <van-field
      v-model="testFieldModelValue"
      name="testField"
      label="testField"
      :rules="[{ required: true, message: '请选择' }]"
    ></van-field>
  </van-form>
  <van-button
    type="primary"
    @click="
      () => {
        FormRef?.validate?.().finally(() => {
          console.log(FormRef?.getValues?.());
        });
      }
    "
  >
    验证
  </van-button>
</template>

<script lang="ts" setup>
import { useWrapperRef } from '@vmono/vhooks';
import { ref } from 'vue';
import { FieldDatePicker } from '@vmono/vant-kit';
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  FormInstance,
} from 'vant';

const FormRef = ref<FormInstance>();

const [modelValue] = useWrapperRef('');
const FieldDatePickerRef = ref<InstanceType<typeof FieldDatePicker>>();

const [testFieldModelValue] = useWrapperRef('');
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
```

## API

### Props

TDatePickerProps & [FieldProps](https://vant-ui.github.io/vant/#/zh-CN/field#props)

### Slots

支持暴露所有 DatePicker Slots

### 方法

支持暴露所有 DatePicker 方法