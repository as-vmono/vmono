# FieldMaskTxt

### 介绍

将脱敏逻辑嵌入表单组件中，将开发者从脱敏相关的具体实现逻辑中解脱出来。

**主要功能描述**

- 脱敏逻辑嵌入表单组件
  - 自动处理数据源(加密数据)的解密逻辑
  - 表单展示值与真正需要收集的值自动分隔开
- 针对不同项目、业务场景，支持自定义：
  - 加解密方法
  - 脱敏占位符号
  - 内置脱敏展示的策略
    - 内部已经支持部分策略（身份证、手机号、邮箱、银行卡号），可根据实际场景设置目标策略。
    - 也支持完全自定义展示策略
- 支持根据脱敏状态，定制不同的表单验证规则
- 支持对真实收集值的 field 组件定制 props

>**脱敏展示逻辑流程**
>
>1. 如果明文包含占位符，则直接展示(此时是后端数据源,前端不干预)
>
>2. 不包含占位符，则使用内置脱敏策略
>
>    脱敏策略优先级：自定义 > 内置类型 > 默认（兜底）
>
>👆**内置脱敏策略的作用：👇**
>
>1. 兼容前端模拟后端脱敏过程的场景
>
>   例如分步表单场景：在第一步填写完毕后(基于后端数据编辑)，在第二步确认信息时(不可编辑)也要默认关闭小眼睛(展示脱敏数据)，保证交互一致性。
>
>   第二步的表单数据已经是纯前端(用户填写)的数据了，所以要前端处理脱敏的展示
>
>2. 为后端兜底：后端直接返回了未脱敏数据

## 代码演示

### 基础用法

```html
<template>
  <demo-block title="基础用法">
    <van-form ref="FormRef" :validate-trigger="['onBlur', 'onChange']">
      <section>
        <span class="desc">设置初始值: 加密且脱敏</span>
        <van-field
          label="明文"
          placeholder="请输入"
          v-model="dataSourcePlainTxt"
        />
        <van-field
          disabled
          label="密文"
          v-model="dataSourceCipherTxt"
          placeholder="输入明文, 制造密文"
        />
        <p>modelValue:</p>
        {{ filedValue }}
        <FieldMaskTxt
          :preset="commonPreset"
          mask-id="maskId"
          v-model="filedValue"
          :field-props="{
            name: 'testField',
            label: '测试字段',
            required: true,
            rules: [{ required: true, message: '请输入' }],
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
import { FieldMaskTxt, TMaskTxtProps } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  FormInstance,
} from 'vant';
import { getAesCryptoTool } from '@vmono/utils';
import { computed, ref, watch } from 'vue';

const { AES_Encrypt, AES_Dencrypt } = getAesCryptoTool({
  key: '12345678',
});

/**
 * 制造数据源
 */
const [dataSourcePlainTxt] = useWrapperRef('12345678');
const dataSourceCipherTxt = computed(
  () => commonPreset.encrypt?.(dataSourcePlainTxt.value) as string,
);
const commonPreset: TMaskTxtProps['preset'] = {
  decrypt: AES_Dencrypt,
  encrypt: AES_Encrypt,
  fetchPlaintext: async (_maskId) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('模拟接口调用');
        resolve(dataSourceCipherTxt.value!);
      }, 1000);
    });
  },
};

/**
 * 表单逻辑
 */
const [filedValue, setFiledValue] = useWrapperRef(dataSourceCipherTxt.value);
watch(dataSourceCipherTxt, setFiledValue);

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

### 根据脱敏状态定制 rules

props.genFieldRules

>初始状态(脱敏)
>
>* 数据被脱敏，不知道数据源真正是什么样子的，因此不需要验证
>
>编辑状态(未脱敏)
>
>* genFieldRules 生成的 rules，默认会分别传入用于展示、用于收集数据的 filed 组件中。
>* 用于收集数据的 filed 组件，值是加密后的，不能通过校验，因此可以配置 real-field-props 控制真实收集数据的 filed 组件 props

```html
<template>
  <demo-block title="根据脱敏状态定制 rules">
    <van-form ref="FormRef" :validate-trigger="['onBlur', 'onChange']">
      <section>
        <span class="desc">设置初始值: 加密且脱敏</span>
        <van-field
          label="明文"
          placeholder="请输入"
          v-model="dataSourcePlainTxt"
        />
        <van-field
          disabled
          label="密文"
          v-model="dataSourceCipherTxt"
          placeholder="输入明文, 制造密文"
        />
        <p>modelValue:</p>
        {{ filedValue }}
        <FieldMaskTxt
          :preset="commonPreset"
          mask-id="maskId"
          v-model="filedValue"
          :field-props="{
            name: 'testField',
            label: '测试字段',
            required: true,
            rules: [{ required: true }],
          }"
          :gen-field-rules="genFieldRules"
          :real-field-props="{
            rules: [],
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
import { FieldMaskTxt, TMaskTxtProps } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  FormInstance,
} from 'vant';
import { getAesCryptoTool, IdRule } from '@vmono/utils';
import { computed, ref, watch } from 'vue';

const { AES_Encrypt, AES_Dencrypt } = getAesCryptoTool({
  key: '12345678',
});

/**
 * 制造数据源
 */
const [dataSourcePlainTxt] = useWrapperRef('130999199909099999');
const dataSourceCipherTxt = computed(
  () => commonPreset.encrypt?.(dataSourcePlainTxt.value) as string,
);
const commonPreset: TMaskTxtProps['preset'] = {
  decrypt: AES_Dencrypt,
  encrypt: AES_Encrypt,
  maskType: 'id',
  fetchPlaintext: async (_maskId) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('模拟接口调用');
        resolve(dataSourceCipherTxt.value!);
      }, 1000);
    });
  },
};

/**
 * 表单逻辑
 */
const [filedValue, setFiledValue] = useWrapperRef(dataSourceCipherTxt.value);
watch(dataSourceCipherTxt, setFiledValue);

const genFieldRules = ({ isPlaintextVisible }) => {
  return [
    {
      required: true,
      message: isPlaintextVisible && IdRule?.message,
      validator:
        isPlaintextVisible &&
        ((value) => {
          return IdRule.pattern.test(value);
        }),
    },
  ];
};

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



## API

### Props

```
TFieldMaskTxtProps
```

| 参数           | 说明                                     | 类型                                                         | 默认值 |
| :------------- | :--------------------------------------- | :----------------------------------------------------------- | :----- |
| preset         | 一些预设                                 | `Omit<IUseMaskedFieldOptions, 'maskId'`                      | -      |
| maskId         | 数据标识,来源于后端，也需传递给后端      | string                                                       | -      |
| modelValue     | 表单真实收集的值                         | string                                                       | -      |
| fieldProps     | 用于展示、真实收集值的表单组件公用 props | `Partial<Omit<FieldProps, 'modelValue'>>`                    | -      |
| genFieldRules  | 根据脱敏状态生成表单验证规则             | `(p: { isPlaintextVisible: boolean }) => FieldProps['rules']` | -      |
| realFieldProps | 用于真实收集值的表单组件 props           | `Partial<Omit<FieldProps, 'modelValue'>>`                    |        |
| loading        | 用于只读、回显数据场景下的异步 loading   | boolean                                                      | false  |

```ts
interface IUseMaskedFieldOptions {
  modelValue: ComputedRef<string>;
  maskId: ComputedRef<string>;
  fetchPlaintext: (maskId: string) => Promise<string>;
  decrypt: (cipher: string) => string;
  encrypt?: (plain: string) => string;
  placeholder?: string;
  /**
   * 自定义脱敏函数（最高优先级）
   * 若提供，则忽略 maskType 和 placeholder
   */
  maskStrategy?: (str: string) => string;
  /**
   * 使用内置脱敏策略（中优先级）
   * 若未提供 maskStrategy，则使用此策略
   */
  maskType?: TMaskType;
  onValueUpdate?: (value: string) => void;
}

type TMaskType = 'id' | 'phone' | 'bankCard' | 'email';
```