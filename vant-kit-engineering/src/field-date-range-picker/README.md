# FieldDatePicker

### 介绍

基于 DateRangePicker 以及 vant 的 field 组件进行二次封装，方便处理表单中的时间范围选择需求场景。

- 支持传入所有 DateRangePicker props（类型 TDateRangePickerProps）
- 支持传入所有的 [vant field props](https://vant-ui.github.io/vant/#/zh-CN/field#props)

**主要功能描述**

- 集成 DateRangePicker 所有功能

**对开发者的解脱**

- 符合 ui 设计
- 重复逻辑抽离

>与普通二开表单组件不同，value 涉及多值，而 vant field value 只能是字符串，因此这里帮给表单的值就是 showValue

## 代码演示

### 基础用法

```html
<template>
  <van-form ref="FormRef">
    <p>modelValue:{{ modelValue }}</p>
    <FieldDateRangePicker
      ref="FieldDateRangePickerRef"
      v-model="modelValue"
      :field-props="{
        name: 'dateField',
        label: 'FieldDateRangePicker',
        labelWidth: '9.5rem',
        readonly: false,
        required: true,
        rules: [{ required: true, message: '请选择' }],
      }"
      :show-value-formatter="
        ({ startDate, endDate }) =>
          startDate &&
          endDate &&
          `${startDate?.toLocaleDateString()} 〰 ${endDate?.toLocaleDateString()}`
      "
      :before-confirm="
        (values) => {
          const [start, end] = values;
          if (start == dayjs().format('YYYY-MM-DD') && start === end) {
            return true;
          }
          showFailToast('请选择当前日期');
          return false;
        }
      "
    >
      <template #confirm> ➡ </template>
    </FieldDateRangePicker>

    <van-field
      v-model="testFieldModelValue"
      name="testField"
      label="testField"
      :rules="[{ required: true, message: '请选择' }]"
    ></van-field>
  </van-form>
  <van-space>
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
      验证表单
    </van-button>
    <van-button type="primary" @click="setPickerRealtimeDate">
      切换默认选中时间为当前日期
    </van-button>
  </van-space>
</template>

<script lang="ts" setup>
import { useWrapperRef } from '@vmono/vhooks';
import { ref } from 'vue';
import { FieldDateRangePicker } from '@vmono/vant-kit';
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  Space as VanSpace,
  FormInstance,
  showFailToast,
} from 'vant';
import dayjs from 'dayjs';
const FormRef = ref<FormInstance>();

const [modelValue] = useWrapperRef<[string, string]>(['', '']);
const FieldDateRangePickerRef =
  ref<InstanceType<typeof FieldDateRangePicker>>();

const setPickerRealtimeDate = () => {
  FieldDateRangePickerRef.value?.setPickerRealtimeDate?.({
    start: dayjs().format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD'),
  });
};

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

TDateRangePickerProps & [FieldProps](https://vant-ui.github.io/vant/#/zh-CN/field#props)

### Slots

支持暴露所有 DateRangePicker Slots

### 方法

支持暴露所有 DateRangePicker 方法