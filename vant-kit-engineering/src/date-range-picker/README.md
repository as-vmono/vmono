# DateRangePicker

### 介绍

主要基于 vant 的 popup、picker-group、date-picker 组件进行二次封装，方便处理时间选择的需求场景。

- 支持传入所有 [date-picker props](https://vant-ui.github.io/vant/#/zh-CN/date-picker#props)
- 支持传入所有 [picker-group props](https://vant-ui.github.io/vant/#/zh-CN/picker-group#props)
- 支持暴露所有 [picker-group slots](https://vant-ui.github.io/vant/#/zh-CN/picker-group#slots)

**主要功能描述**

- 支持自定义触发器
- 支持自定义展示值
- 支持更改 picker 打开时默认选中的值（modelValue 有值，则以 modelValue 为准）
- 支持根据选择的时间大小自动矫正 values 的顺序
- 支持确认前的自定义拦截处理逻辑

**对开发者的解脱**

- 符合 ui 设计
  - 默认处理选项的 formatter
  - 默认 title、tabs、nextStepText 配置
- 无脑的双向绑定 values，自动矫正时间顺序
- 打开收起逻辑的编写
- 对所选项 `真实值`、`展示值` 的隔离和处理

## 代码演示

### 基础用法

```html
<template>
  <DateRangePicker
    v-model="modelValue"
    :picker-group-props="{ title: '基础用法' }"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value: {{ modelValue }}</p>
        <p>showValue: {{ showValue }}</p>
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef<[string, string]>(['', '']);
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

props：`showValueFormatter?: (p: { startDate?: Date; endDate?: Date }) => string`

```html
<template>
  <DateRangePicker
    v-model="modelValue"
    :show-value-formatter="
      ({ startDate, endDate }) => {
        if (startDate && endDate) {
          return (
            dayjs(startDate).format('YY年MM月DD日') +
            ' / ' +
            dayjs(endDate).format('YY年MM月DD日')
          );
        }
      }
    "
    :picker-group-props="{ title: '格式化展示值' }"
    @confirm="
      (p) => {
        showToast(`dayjs(date).format('YY年MM月DD日'))`);
        console.log(p);
      }
    "
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value: {{ modelValue }}</p>
        <p>showValue: {{ showValue }}</p>
        <van-button type="primary" @click="triggerPopupShow">
          trigger
        </van-button>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { Button as VanButton, showToast } from 'vant';
import dayjs from 'dayjs';

const [modelValue] = useWrapperRef<[string, string]>([
  '2020-03-04',
  '2030-05-06',
]);
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
  <DateRangePicker
    ref="DateRangePickerRef"
    v-model="modelValue"
    :picker-group-props="{ title: '设置 picker 默认选中项' }"
  >
    <template #trigger="{ triggerPopupShow, pickerRealtimeOptions, showValue }">
      <div class="trigger-box">
        <p>value:{{ modelValue }}</p>
        <p>showValue:{{ showValue }}</p>
        <p>picker 实时选中值👇</p>
        <p>{{ pickerRealtimeOptions }}</p>
        <p>(modelValue 有值，则以 modelValue 为准)</p>
        <van-space>
          <van-button type="primary" @click="triggerPopupShow">
            trigger
          </van-button>
          <van-button
            type="warning"
            @click="
              () =>
                DateRangePickerRef?.setPickerRealtimeDate({
                  start: '2022-02-02',
                  end: '2033-03-03',
                })
            "
          >
            2022-02-02 ~ 2033-03-03
          </van-button>
        </van-space>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { ref } from 'vue';
import { Button as VanButton, Space as VanSpace } from 'vant';

const DateRangePickerRef = ref<InstanceType<typeof DateRangePicker>>();

const [modelValue] = useWrapperRef<[string, string]>([
  '2020-03-04',
  '2030-05-06',
]);
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

### 确认前的自定义拦截处理逻辑

props：`beforeConfirm?: (newValues: string[]) => boolean;`

* 返回 true，values 正常更新，弹窗关闭
* 返回 false，则什么都不做

```html
<template>
  <DateRangePicker
    v-model="modelValue"
    :picker-group-props="{ title: 'beforeConfirm' }"
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
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value: {{ modelValue }}</p>
        <p>showValue: {{ showValue }}</p>
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { showFailToast, Button as VanButton } from 'vant';
import dayjs from 'dayjs';

const [modelValue] = useWrapperRef<[string, string]>(['', '']);
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
  <DateRangePicker
    v-model="modelValue"
    :picker-group-props="{ title: '设置 columnsType' }"
    :picker-props="{ columnsType: ['month', 'day'] }"
  >
    <template #trigger="{ triggerPopupShow, showValue }">
      <div class="trigger-box">
        <p>value: {{ modelValue }}</p>
        <p>showValue: {{ showValue }}</p>
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef<[string, string]>(['', '']);
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

### 支持所有 picker-group props

例如设置 confirmButtonText

```html
<template>
  <DateRangePicker
    v-model="modelValue"
    :picker-group-props="{
      title: '设置 confirmButtonText',
      confirmButtonText: '👉✅👈',
    }"
  >
    <template #trigger="{ triggerPopupShow }">
      <div class="trigger-box">
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef<[string, string]>(['', '']);
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

### 支持所有 picker-group slots

例如设置 toolbar

```html
<template>
  <DateRangePicker
    v-model="modelValue"
    :picker-group-props="{ title: '设置 toolbar' }"
  >
    <template #trigger="{ triggerPopupShow }">
      <div class="trigger-box">
        <van-button @click="triggerPopupShow"> trigger </van-button>
      </div>
    </template>

    <template #toolbar> 👉自定义工具栏👈 </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { DateRangePicker } from '@vmono/vant-kit';
import { Button as VanButton } from 'vant';

const [modelValue] = useWrapperRef<[string, string]>(['', '']);
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

TDatePickerProps

| 参数               | 说明                                                         | 类型                                                         | 默认值 |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------ |
| modelValue         | 值                                                           | `string[]`                                                   | -      |
| pickerProps        | [date-picker props](https://vant-ui.github.io/vant/#/zh-CN/date-picker#props) | `Partial<DatePickerProps>`                                   | -      |
| pickerGroupProps   | [picker-group props](https://vant-ui.github.io/vant/#/zh-CN/picker-group#props) | `Partial<PickerGroupProps>`                                  | -      |
| showValueFormatter | 自定义展示值                                                 | `showValueFormatter?: (p: { startDate?: Date; endDate?: Date }) => string` | -      |
| beforeConfirm      | 确认前的自定义拦截处理逻辑                                   | `beforeConfirm?: (newValues: TDateRangePickerProps['modelValue']) => boolean` | -      |

### Slots

支持暴露所有 [picker-group slots](https://vant-ui.github.io/vant/#/zh-CN/picker-group#slots)

| 插槽名  | 说明   | 参数                                                    |
| ------- | ------ | ------------------------------------------------------- |
| trigger | 触发器 | `{ showValue, triggerPopupShow, pickerRealtimeOptions}` |

### 方法

| 方法名                | 说明                                                         | 类型                                          |
| :-------------------- | :----------------------------------------------------------- | :-------------------------------------------- |
| setPickerRealtimeDate | 设置 picker 打开时默认选中的值（modelValue 有值，则以modelValue 为准） | `(p: { start: string; end: string }) => void` |
