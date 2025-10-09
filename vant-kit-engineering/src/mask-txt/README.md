# MaskTxt

### 介绍

脱敏文本组件

**主要功能描述**

- 自动处理数据源(加密数据)的解密逻辑
- 针对不同项目、业务场景，支持自定义：
  - 加解密方法
  - 脱敏占位符号
  - 脱敏展示的策略
    - 内部已经支持部分策略（身份证、手机号、邮箱、银行卡号），可自由配置。
    - 也支持完全自定义
- 针对 ui，支持自定义：
  - 默认展示的图标大小
  - 完全自定义展示逻辑

**对开发者的解脱**

* 默认的 ui、交互处理
* 当数据源不符合与后端约定的格式，组件内部兜底加解密的展示。

## 代码演示

### 基础用法

必要配置项：

* preset 预设，一般在一个项目中是通用的
  * encrypt 加密方法
  * decrypt 解密方法
  * fetchPlaintext 获取未脱敏数据的异步方法
* maskId 数据标识
* mask-txt 数据源(加密且脱敏)

>内部兜底逻辑：
>
>* 如果数据源符合要求（加密且脱敏 - 根据是否包含脱敏占位符号来判断），则走调用接口的逻辑。
>* 反之，不符合要求，走前端兜底策略
>  * 例如再右侧示例中输入 12345678 和 123**678 的展示效果是一致的，只不过当数据源本身包含脱敏占位符(默认为 *)时，点击小眼睛会走调用接口逻辑，界面可以观察到 loading 效果。

```html
<template>
  <demo-block title="基础用法">
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
      <mask-txt
        :preset="commonPreset"
        mask-id="maskId"
        :mask-txt="dataSourceCipherTxt"
      />
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import { MaskTxt, TMaskTxtProps } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Field as VanField } from 'vant';
import { getAesCryptoTool } from '@vmono/utils';
import { computed } from 'vue';

const { AES_Encrypt, AES_Dencrypt } = getAesCryptoTool({
  key: '12345678',
});

/**
 * 制造数据源
 */
const [dataSourcePlainTxt] = useWrapperRef('');
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

### 自定义脱敏占位符号

preset.placeholder

```ts
const commonPreset: TMaskTxtProps['preset'] = {
  ……
  placeholder: '$'
};
```

### 自带一些内置脱敏策略

preset.maskType

`TMaskTxtProps['preset']['maskType']`

### 自定义脱敏策略

preset.maskStrategy

`TMaskTxtProps['preset']['maskStrategy']`

```ts
const commonPreset: TMaskTxtProps['preset'] = {
  ……
  placeholder: '😀',
  maskStrategy(str) {
    try {
      return `👉${str.replace(/./g, '😀')}👈`;
    } catch (_) {
      _;
      return '';
    }
  },
};
```

### 更改默认展示的图标大小

```html
  <mask-txt
    ……
    icon-size="30"
  />
```

### 完全自定义展示逻辑

* 插槽支持暴露完善的 api

```html
  <mask-txt
    :preset="commonPreset"
    mask-id="maskId"
    :mask-txt="dataSourceCipherTxt"
  >
    <template
      #default="{
        showValue,
        loading,
        isPlaintextVisible,
        toggleVisibility,
      }"
    >
      <van-button @click="toggleVisibility">
        <span style="color: red">{{ showValue }}</span>
        <van-icon
          v-if="!loading"
          :size="16"
          :name="isPlaintextVisible ? 'eye' : 'browsing-history'"
        />
        <van-loading v-else :size="16" type="spinner" />
      </van-button>
    </template>
  </mask-txt>
```



## API

### Props

`TMaskTxtProps`

| 参数     | 说明                                | 类型                                                         | 默认值 |
| -------- | ----------------------------------- | ------------------------------------------------------------ | ------ |
| maskId   | 数据标识,来源于后端，也需传递给后端 | string                                                       | -      |
| maskTxt  | 数据源（默认期望加密且脱敏）        | string                                                       | -      |
| iconSize | 默认所展示的图标大小                | string \| number                                             | 16     |
| preset   | 一些预设                            | `Omit<IUseMaskedFieldOptions, 'maskId' | 'modelValue' | 'onValueUpdate'` | -      |

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

### slots

| 名称    | 说明               | 参数                                                         |
| :------ | :----------------- | :----------------------------------------------------------- |
| default | 控制组件的展示效果 | `{ show-value, loading, is-plaintext-visible, toggle-visibility}` |