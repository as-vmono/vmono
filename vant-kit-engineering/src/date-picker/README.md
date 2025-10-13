# DatePicker

### 介绍

主要基于 vant 的 popup、date-picker 组件进行二次封装，方便处理时间选择的需求场景。

- 支持传入所有 [date-picker props](https://vant-ui.github.io/vant/#/zh-CN/date-picker#props)
- 支持暴露所有 [date-picker slots](https://vant-ui.github.io/vant/#/zh-CN/date-picker#slots)

**主要功能描述**

- 支持自定义触发器
- 支持自定义展示值
- 支持更改 picker 打开时默认选中的值（modelValue 有值，则以modelValue 为准）

**对开发者的解脱**

- 符合 ui 设计
  - 默认处理选项的 formatter
- 打开收起逻辑的编写
- 对所选项 `真实值`、`展示值` 的隔离和处理

>提供表单组件版本 [FieldDatePicker](./#/field-date-picker)

## 代码演示

### 基础用法

```html
<template>
  <DatePicker v-model="modelValue" :picker-props="{ title: '基础用法' }">
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DatePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef('');
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

### 格式化展示值

```html
<template>
  <DatePicker
    v-model="modelValue"
    :show-value-formatter="(date) => dayjs(date).format('YY年MM月DD日')"
    :picker-props="{ title: '格式化展示值' }"
    @confirm="
      (p) => {
        showToast(`dayjs(date).format('YY年MM月DD日'))`);
        console.log(p);
      }
    "
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <van-button type="primary" @click="triggerPopupShow">
          trigger
        </van-button>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DatePicker } from '@vmono/vant-kit';
import { Button as VanButton, showToast } from 'vant';
import dayjs from 'dayjs';

const [modelValue] = useWrapperRef('2030-03-04');
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

### 自定义 picker 打开时默认选中的值

modelValue 有值，则以 modelValue 为准

```html
<template>
  <DatePicker
    ref="DatePickerRef"
    v-model="modelValue"
    :picker-props="{ title: '设置 picker 默认选中项' }"
  >
    <template #trigger="{ triggerPopupShow, pickerRealtimeOptions, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <p>picker 实时选中值:{{ pickerRealtimeOptions }}</p>
        <p>(modelValue 有值，则以 modelValue 为准)</p>
        <van-space>
          <van-button type="primary" @click="triggerPopupShow">
            trigger
          </van-button>
          <van-button
            type="warning"
            @click="() => DatePickerRef?.setPickerRealtimeDate('2035-05-06')"
          >
            2035-05-06
          </van-button>
        </van-space>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DatePicker } from '@vmono/vant-kit';
import { ref } from 'vue';
import { Button as VanButton, Space as VanSpace } from 'vant';

const [modelValue] = useWrapperRef('2030-03-04');
const DatePickerRef = ref<InstanceType<typeof DatePicker>>();
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

### 支持所有 date-picker props

例如设置 columnsType 为: 月日

```html
<template>
  <DatePicker
    v-model="modelValue"
    :picker-props="{ title: '基础用法', columnsType: ['month', 'day'] }"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DatePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef('');
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

### 支持所有 date-picker slots

例如设置 columns-top

```html
<template>
  <DatePicker v-model="modelValue" :picker-props="{ title: '基础用法' }">
    <template #trigger="{ triggerPopupShow }">
      <div class="trigger-box">
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
    <template #columns-top>
      <div class="columns-top-bar">
        <span>这里是 columns-top 插槽内容</span>
      </div>
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DatePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef('');
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.columns-top-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
```



## API

### Props

TDatePickerProps

| 参数               | 说明                                                         | 类型                                           | 默认值 |
| ------------------ | ------------------------------------------------------------ | ---------------------------------------------- | ------ |
| modelValue         | 值                                                           | string                                         | -      |
| pickerProps        | [date-picker props](https://vant-ui.github.io/vant/#/zh-CN/date-picker#props) | `Partial<DatePickerProps>`                     | -      |
| showValueFormatter | 自定义展示值                                                 | `showValueFormatter?: (date?: Date) => string` | -      |

### Slots

支持暴露所有 [date-picker slots](https://vant-ui.github.io/vant/#/zh-CN/date-picker#slots)

| 插槽名  | 说明   | 参数                                                    |
| ------- | ------ | ------------------------------------------------------- |
| trigger | 触发器 | `{ triggerPopupShow, showValue, pickerRealtimeOptions}` |

### 方法

| 方法名                | 说明                                                         | 类型                         |
| :-------------------- | :----------------------------------------------------------- | :--------------------------- |
| setPickerRealtimeDate | 设置 picker 打开时默认选中的值（modelValue 有值，则以modelValue 为准） | `(newValue: string) => void` |