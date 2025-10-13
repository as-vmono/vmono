# MultiPicker

### 介绍

主要基于 vant 的 Popup、CheckboxGroup 等组件进行二次封装，方便处理多项选择的需求场景。

**主要功能描述**

- 支持自定义触发器
- 支持开启搜索功能
- 自定义文本提示信息

**对开发者的解脱**

- 符合 ui 设计
- 打开收起逻辑的编写
- 对所选项的 `真实值`、`展示值` 的处理
- 基于上次选中的结果进行编辑后，点击取消，回滚上次选中的状态

>提供表单组件版本 [FieldMultiPicker](./#/field-multi-picker)

## 代码演示

### 基础用法

```html
<template>
  <MultiPicker
    v-model="pickerValue"
    :options="options"
    :field-names="fieldNames"
    title="基础用法"
    tip-txt="💫这是一段提示文本: 你可以根据业务需要自行定制展示的内容"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <van-button type="primary" @click="triggerPopupShow">
          点击打开多选-选择器🤪
        </van-button>
        <p>show value: {{ showValue }}</p>
        <p>modelValue: {{ pickerValue }}</p>
      </div>
    </template>
  </MultiPicker>
</template>

<script setup lang="ts">
  import { useWrapperRef } from '@vmono/vhooks';
  import { MultiPicker } from '@vmono/vant-kit';
  import { Button as VanButton } from 'vant';

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

### 开启搜索功能

- 传入 show-earch 展示搜索框
- 侦听 search 事件处理搜索逻辑

> 💫 对交互细节的优化：如果在输入关键字进行搜索后，新的数据源为空，此时点击确定，更新的值依旧为最近一次选中的选项。

```html
<template>
  <MultiPicker
    v-model="pickerValue"
    :options="options"
    :field-names="fieldNames"
    title="基础用法"
    tip-txt="💫开启了搜索功能"
    show-search
    @search="onSearch"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <van-button type="primary" @click="triggerPopupShow">
          带搜索框🔍
        </van-button>
        <p>show value: {{ showValue }}</p>
        <p>modelValue: {{ pickerValue }}</p>
      </div>
    </template>
  </MultiPicker>
</template>

<script setup lang="ts">
  import { useWrapperRef } from '@vmono/vhooks';
  import { MultiPicker } from '@vmono/vant-kit';
  import { Button as VanButton } from 'vant';
  import { checkStrIsEmpty } from '@vmono/utils';

  const optionsDataSource = [
    { name: '选项1', value: '1' },
    { name: '选项2', value: '2', disabled: true },
    { name: '选项3', value: '3' },
    { name: '选项4', value: '4', disabled: true },
    { name: '选项5', value: '5' },
    { name: '选项6', value: '6' },
    { name: '选项7', value: '7', disabled: true },
    { name: '选项8', value: '8' },
    { name: '选项9', value: '9' },
    { name: '选项10', value: '10' },
    { name: '选项11', value: '11', disabled: true },
    { name: '选项12', value: '12' },
    { name: '选项13', value: '13', disabled: true },
    { name: '选项14', value: '14' },
    { name: '选项15', value: '15' },
    { name: '选项16', value: '16', disabled: true },
    { name: '选项17', value: '17' },
    { name: '选项18', value: '18' },
    { name: '选项19', value: '19' },
    { name: '选项20', value: '20' },
  ];
  const [options, setOptions] = useWrapperRef(optionsDataSource);

  const fieldNames = {
    label: 'name',
    value: 'value',
  };
  const [pickerValue, _setPickerValue] = useWrapperRef<string[]>([]);

  const onSearch = (keywords: string) => {
    if (checkStrIsEmpty(keywords)) {
      setOptions(optionsDataSource);
    } else {
      setOptions(
        optionsDataSource.filter((item) =>
          item.name.toLocaleLowerCase().includes(keywords.toLocaleLowerCase()),
        ),
      );
    }
  };
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

TMultiPickerProps

| 参数         | 说明               | 类型                                                                                   | 默认值                             |
| ------------ | ------------------ | -------------------------------------------------------------------------------------- | ---------------------------------- |
| v-model      | 当前选中项对应的值 | string[]                                                                               | -                                  |
| options      | 选项               | Array<{ label: string; value: string; disabled?: boolean }> (label、value支持属性别名) | -                                  |
| fieldNames   | 字段别名           | { label?: string; value?: string; }                                                    | { label: 'label', value: 'value' } |
| title        | 标题               | string                                                                                 | -                                  |
| tipTxt       | 文本提示信息       | string                                                                                 | -                                  |
| show-search  | 是否显示搜索框     | boolean                                                                                | false                              |
| search-delay | 搜索防抖时间(ms)   | number                                                                                 | 300                                |

### Events

| 事件名         | 说明                           | 回调参数                                                 |
| :------------- | :----------------------------- | :------------------------------------------------------- |
| confirm        | 点击确认后触发的事件           | TConfirmEventPayload = { values: any[]; options: any[] } |
| search         | 在搜索框输入时，触发的搜索事件 | keywords                                                 |
| toggleCheckbox | 触发选中、取消选中时的事件     | values                                                   |

### Slots

| 名称    | 说明   | 参数                                                                              |
| :------ | :----- | :-------------------------------------------------------------------------------- |
| trigger | 触发器 | `{ trigger-popup-show: () => void; show-value: string; selected-options: any[] }` |
