# CopyTxtTrigger

### 介绍

复制文本按钮组件

**主要功能描述**

- 内置复制文本方法，并尽可能对 copy 方法做了移动端、旧浏览器的兼容
- 支持自定义渲染 trigger

## 代码演示

### 基础用法

```html
<template>
  <demo-block title="基础用法">
    <section>
      <span class="desc">自带默认的 '复制' 按钮展示效果</span>
      <van-field
        label="文本框"
        placeholder="输入内容后点击复制按钮"
        v-model="txt"
      >
        <template #right-icon>
          <CopyTxtTrigger :txt="txt" />
        </template>
      </van-field>
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import { CopyTxtTrigger } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Field as VanField } from 'vant';

const [txt] = useWrapperRef('');
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

### 自定义 trigger

插槽暴露 `copy` 方法

```html
<template>
  <demo-block title="基础用法">
    <section>
      <span class="desc">自定义 trigger</span>
      <van-field label="文本框" placeholder="请输入" v-model="txt">
        <template #right-icon>
          <CopyTxtTrigger :txt="txt">
            <template #default="{ copy }">
              <van-button size="mini" type="primary" @click="copy(txt!)">
                复制内容
              </van-button>
            </template>
          </CopyTxtTrigger>
        </template>
      </van-field>
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import { CopyTxtTrigger } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Field as VanField, Button as VanButton } from 'vant';

const [txt] = useWrapperRef('');
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

```ts
export type TCopyTxtTriggerProps = {
  txt: string;
};
```

### Slots

| 名称    | 说明           | 参数        |
| :------ | :------------- | :---------- |
| default | 自定义 trigger | `copy` 方法 |

### 方法

| 方法名 | 说明           | 类型                           |
| :----- | :------------- | :----------------------------- |
| copy   | 复制文本的方法 | `copy: (text: string) => void` |