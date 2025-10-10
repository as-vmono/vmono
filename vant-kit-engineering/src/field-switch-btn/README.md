# FieldSwitchBtn

### 介绍

基于 vant 的 field 组件进行二次封装，方便处理表单中的选择按钮场景。

**主要功能描述**

- 内置默认选项
- 支持自定义选项

**对开发者的解脱**

- 符合 ui 设计
- 内部兼容 disable、readonly 场景的逻辑、样式处理
- 展示值与表单收集值的逻辑隔离

## 代码演示

### 基础用法

> van-field 组件会将传入的 number 转化为 string，因此即便内置的 options 默认值是数字，最终 v-model 后也会转化成 string
>
> ```ts
> const defaultOptions: TSwitchOptions = [
>   { label: '是', value: 1 },
>   { label: '否', value: 0 },
> ];
> ```
>
> 由于不确定外部自定义的 value 是什么类型，所以这里没有强制做类型转换。
>
> **你可以通过组件暴露的 onChange 事件拿到选中的 option 的所有原始信息**。

```html
<template>
  <demo-block title="基础用法">
    <van-form ref="FormRef" :validate-trigger="['onBlur', 'onChange']">
      <section>
        <p>filedValue({{ typeof filedValue }}): {{ filedValue }}</p>
        <FieldSwitchBtn
          v-model="filedValue"
          :field-props="{
            name: 'testField',
            label: '测试字段',
            required: true,
            rules: [{ required: true, message: '请选择' }],
          }"
        />
      </section>
      <van-button round block type="primary" @click="handleSubmit">
        提交
      </van-button>
    </van-form>
  </demo-block>
</template>

<script setup lang="ts">
import { FieldSwitchBtn } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Form as VanForm, Button as VanButton, FormInstance } from 'vant';
import { ref } from 'vue';

/**
 * 表单逻辑
 */
const [filedValue] = useWrapperRef<any>(undefined);

const FormRef = ref<FormInstance>();
const handleSubmit = () => {
  FormRef.value?.validate().then(() => {
    // eslint-disable-next-line no-console
    console.log('getValues', FormRef.value?.getValues?.());
  });
};
</script>

<style scoped lang="less">
section {
  padding: 0px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;

  .desc {
    font-size: 12px;
    align-self: flex-start;
    color: #aaa;
  }
}
</style>
```

### onChange 事件

你可以通过组件暴露的 onChange 事件拿到选中的 option 的所有原始信息

```html
<FieldSwitchBtn
  v-model="filedValue"
  :field-props="{
    name: 'testField',
    label: '测试字段',
    required: true,
    rules: [{ required: true, message: '请选择' }],
  }"
  @change="
    (opt) => {
      showToast(JSON.stringify(opt));
      setFiledValue(opt.value);
    }
  "
/>
```

### 自定义 options

```html
<FieldSwitchBtn
  v-model="filedValue"
  :options="[
    { label: '非长期', value: '非长期' },
    { label: '长期', value: '长期' },
  ]"
  :field-props="{
    name: 'validityPeriodField',
    label: '证件有效期',
    required: true,
    rules: [{ required: true, message: '请选择' }],
  }"
/>
```



## API

### Props

| 参数       | 说明        | 类型                                      | 默认值 |
| ---------- | ----------- | ----------------------------------------- | ------ |
| modelValue | 双向绑定值  | any                                       | -      |
| fieldProps | field props | `Partial<Omit<FieldProps, 'modelValue'>>` | -      |
| options    | 自定义选项  | `TSwitchOptions`                          | -      |

```ts
export type TSwitchOption = { label: string; value: any };

export type TSwitchOptions = [TSwitchOption, TSwitchOption];

export type TFieldSwitchBtnProps = {

 modelValue: any;

 fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;

 options?: TSwitchOptions;

};
```

### Events

继承 MultiPicker

| 事件名 | 说明             | 回调参数        |
| :----- | :--------------- | :-------------- |
| change | 更改选中值时触发 | `TSwitchOption` |
