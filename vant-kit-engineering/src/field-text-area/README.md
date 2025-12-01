# FieldTextarea

### 介绍

基于 vant 的 field 组件进行二次封装。

**主要功能描述**

- 内置默认选项
- 支持自定义选项

**对开发者的解脱**

- 符合 ui 设计

## 代码演示

### 基础用法

设置 maxlength 后,自动展示字符输入进度

```html
<template>
  <demo-block title="基础用法">
    <van-form ref="FormRef" :validate-trigger="['onBlur', 'onChange']">
      <section class="demo-section">
        <span class="demo-section-desc">设置 maxlength,自动展示字符进度</span>
        <FieldTextarea
          v-model="filedValue"
          :field-props="{
            name: 'testField',
            label: '测试字段',
            required: true,
            rules: [{ required: true, message: '请填写' }],
            maxlength: 200,
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
  import { FieldTextarea } from '@vmono/vant-kit';
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
  //
</style>
```

## API

### Props

| 参数       | 说明        | 类型                                      | 默认值 |
| ---------- | ----------- | ----------------------------------------- | ------ |
| modelValue | 双向绑定值  | `string`                                  | -      |
| fieldProps | field props | `Partial<Omit<FieldProps, 'modelValue'>>` | -      |

```ts
export type TFieldTextareaProps = {
  fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
};
```
