# SinglePicker

### 介绍

主要基于 vant 的 popup、picker 组件进行二次封装，方便处理单项选择的需求场景。

- 支持传入所有 [picker props](https://vant-ui.github.io/vant/#/zh-CN/picker#props)
- 支持暴露所有 [picker slots](https://vant-ui.github.io/vant/#/zh-CN/picker#slots)

**主要功能描述**

- 支持自定义触发器
- 支持开启搜索功能
- 禁用选项逻辑增强

**对开发者的解脱**

- 符合 ui 设计
- 打开收起逻辑的编写
- 对所选项的 `真实值`、`展示值` 的处理

## 代码演示

### 基础用法

```html
<template>
  <SinglePicker
    v-model="pickerValue"
    :picker-props="{
      title: '基础用法',
      columns: columns,
      columnsFieldNames: columnsFieldNames,
    }"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <van-button type="primary" @click="triggerPopupShow">
          点击打开选择器🤪
        </van-button>
        <p>show value: {{ showValue }}</p>
        <p>modelValue: {{ pickerValue }}</p>
      </div>
    </template>
  </SinglePicker>
</template>

<script setup lang="ts">
  import { useWrapperRef } from '@vmono/vhooks';
  import { SinglePicker } from '@vmono/vant-kit';
  import { Button as VanButton } from 'vant';

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
  <SinglePicker
    v-model="pickerValue"
    :picker-props="{
      columns: columns,
      columnsFieldNames: columnsFieldNames,
    }"
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

    <template #title>Ashun</template>
  </SinglePicker>
</template>

<script setup lang="ts">
  import { useWrapperRef } from '@vmono/vhooks';
  import { SinglePicker } from '@vmono/vant-kit';
  import { Button as VanButton } from 'vant';
  import { checkStrIsEmpty } from '@vmono/utils';

  const columnsDataSource = [
    { name: '选项1', value: '1' },
    { name: '选项2', value: '2' },
  ];
  const [columns, setColumns] = useWrapperRef(columnsDataSource);
  const columnsFieldNames = {
    text: 'name',
    value: 'value',
  };
  const [pickerValue, _setPickerValue] = useWrapperRef<string | undefined>(
    undefined,
  );

  const onSearch = (keywords: string) => {
    if (checkStrIsEmpty(keywords)) {
      setColumns(columnsDataSource);
    } else {
      setColumns(
        columnsDataSource.filter((item) =>
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

### 禁用选项逻辑增强

```html
<template>
  <SinglePicker
    v-model="pickerValue"
    :picker-props="{
      title,
      columns: columns,
      columnsFieldNames: columnsFieldNames,
    }"
    @confirm-disabled-option="
      ({}) =>
        showToast(
          '你可以自定义后续操作,回调函数参数类型 TSPConfirmDisabledOptionPayload',
        )
    "
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <span>
          <van-button @click="showPartialDisableOptions(triggerPopupShow)">
            部分选项禁用
          </van-button>
          <van-button @click="showAllDisableOptions(triggerPopupShow)">
            全部选项禁用
          </van-button>
        </span>
        <p>show value: {{ showValue }}</p>
        <p>modelValue: {{ pickerValue }}</p>
      </div>
    </template>
  </SinglePicker>
</template>

<script setup lang="ts">
  import { useWrapperRef } from '@vmono/vhooks';
  import { SinglePicker } from '@vmono/vant-kit';
  import { showToast, Button as VanButton } from 'vant';

  const partialDisableCols = [
    { name: '选项1', value: '1' },
    { name: '选项2(禁用)', value: '2', disabled: true },
    { name: '选项3', value: '3' },
  ];
  const allDisableCols = [
    { name: '选项1(禁用)', value: '1(禁用)', disabled: true },
    { name: '选项2(禁用)', value: '2(禁用)', disabled: true },
    { name: '选项3(禁用)', value: '3(禁用)', disabled: true },
  ];
  const [columns, setColumns] = useWrapperRef(partialDisableCols);
  const columnsFieldNames = {
    text: 'name',
    value: 'value',
  };
  const [pickerValue, _setPickerValue] = useWrapperRef<string | undefined>(
    undefined,
  );

  const [title, setTitle] = useWrapperRef<string>('');
  const showPartialDisableOptions = (triggerPopupShow) => {
    setTitle('部分选项禁用');
    setColumns(partialDisableCols);
    triggerPopupShow();
  };
  const showAllDisableOptions = (triggerPopupShow) => {
    setTitle('全部选项禁用');
    setColumns(allDisableCols);
    triggerPopupShow();
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

| 参数         | 说明                                                                            | 类型                 | 默认值 |
| ------------ | ------------------------------------------------------------------------------- | -------------------- | ------ |
| v-model      | 当前选中项对应的值                                                              | string \| undefinerd | -      |
| picker-props | [vant Picker 组件的 props](https://vant-ui.github.io/vant/#/zh-CN/picker#props) |                      |        |
| show-search  | 是否显示搜索框                                                                  | boolean              | false  |
| search-delay | 搜索防抖时间(ms)                                                                | number               | 300    |

### Events

| 事件名                | 说明                           | 回调参数                                                                        |
| :-------------------- | :----------------------------- | :------------------------------------------------------------------------------ |
| confirm               | 点击 picker 确认后触发的事件   | option (选中项的全部数据)                                                       |
| search                | 在搜索框输入时，触发的搜索事件 | keywords                                                                        |
| confirmDisabledOption | 选中禁用项时，触发的事件       | type TSPConfirmDisabledOptionPayload = { option: any; closePopup: () => void; } |

### Slots

| 名称    | 说明   | 参数                                                                           |
| :------ | :----- | :----------------------------------------------------------------------------- |
| trigger | 触发器 | `{ trigger-popup-show: () => void; show-value: string; selected-option: any }` |
