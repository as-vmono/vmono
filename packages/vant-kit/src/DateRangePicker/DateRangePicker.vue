<template>
  <div class="vantkit-date-range-picker">
    <slot
      name="trigger"
      :show-value="showValue"
      :trigger-popup-show="triggerPopupShow"
      :picker-realtime-options="rangePickerRealtimeOptions"
    >
    </slot>

    <!-- 日期范围选择弹窗 -->
    <van-popup v-model:show="popupShow" position="bottom" round>
      <van-picker-group v-bind="computedPickerGroupProps" @confirm="onConfirmPicker" @cancel="setPopupShow(false)">
        <!-- 暴露 picker-group 默认支持的插槽-->
        <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
          <slot :name="name" v-bind="slotData" :key="name"> </slot>
        </template>
        <van-date-picker v-bind="computedPickerProps" v-model="currentStartDate">
          <!-- 暴露 date-picker 默认支持的插槽(开始时间) 实测 data-picker 的插槽无效(被 picker-group 挤占) -->
          <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
            <slot :name="`${name}-start`" v-bind="slotData" :key="`${name}-start`"> </slot>
          </template>
        </van-date-picker>
        <van-date-picker v-bind="computedPickerProps" v-model="currentEndDate">
          <!-- 暴露 date-picker 默认支持的插槽(结束时间) 实测 data-picker 的插槽无效(被 picker-group 挤占) -->
          <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
            <slot :name="`${name}-end`" v-bind="slotData" :key="`${name}-end`"></slot>
          </template>
        </van-date-picker>
      </van-picker-group>
    </van-popup>
  </div>
</template>

<script lang="ts">
const defaultShowValue = '';
const dateValueDelimiter = '-';
const defaultShowDateRangeDelimiter = '~';

export type TDateRangePickerConfirmPayload = { values: TDateRangePickerProps['modelValue'] };
export type TSetDRPickerRealtimeDatePayload = { start: string; end: string };
export type TDRPickerShowValueFormatterPayload = { startDate?: Date; endDate?: Date };

export type TDateRangePickerProps = {
  modelValue: string[];
  pickerProps?: Partial<DatePickerProps>;
  pickerGroupProps?: Partial<PickerGroupProps>;
  showValueFormatter?: (p: TDRPickerShowValueFormatterPayload) => string | undefined;
  beforeConfirm?: (newValues: TDateRangePickerProps['modelValue']) => boolean;
};
</script>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import type { DatePickerProps, PickerGroupProps } from 'vant';
import { useWrapperRef } from '@vmono/vhooks';
import dayjs from 'dayjs';

const Props = defineProps<TDateRangePickerProps>();

const defaultColumnsFormatter = (type, option) => {
  if (type === 'year') {
    option.text += '年';
  }
  if (type === 'month') {
    option.text += '月';
  }
  if (type === 'day') {
    option.text += '日';
  }
  return option;
};
const computedPickerProps = computed(() => {
  const pickerProps = Props?.pickerProps || {};
  const formatter = pickerProps?.formatter || defaultColumnsFormatter;
  const columnsType = Props?.pickerProps?.columnsType || ['year', 'month', 'day'];
  return { ...pickerProps, formatter, columnsType };
});

const computedPickerGroupProps = computed(() => {
  const pickerGroupProps = Props?.pickerGroupProps || {};
  return { title: '时间范围', tabs: ['开始时间', '结束时间'], nextStepText: '下一步', ...pickerGroupProps };
});

const Emitter = defineEmits<{
  (e: 'confirm', p: TDateRangePickerConfirmPayload): void;
  (e: 'update:modelValue', value: TDateRangePickerProps['modelValue']): void;
}>();

// 控制弹窗显示
const [popupShow, setPopupShow] = useWrapperRef<boolean>(false);
const triggerPopupShow = () => {
  setPopupShow(true);
};

// 真实绑定的选项值
const [modelValue, setModelValue] = useWrapperRef<string[]>(Props.modelValue ?? []);
watch(
  () => Props.modelValue,
  (newValues) => {
    setModelValue(newValues);
  },
  { immediate: true }
);

// 显示值处理
const [showValue, setShowValue] = useWrapperRef<string>(defaultShowValue);
/**
 * picker 实时选中的日期值
 */
const limitValueByColumnsType = (value: string[]) => {
  // 默认值 ['year', 'month', 'day']
  const columnsType = computedPickerProps.value?.columnsType;
  value.length = columnsType.length;
  return value;
};
// 格式化后的值
const [currentFormatedStartDate, setCurrentFormatedStartDate] = useWrapperRef<string | undefined>(
  Props.modelValue?.[0]
);
const [currentFormatedEndDate, setCurrentFormatedEndDate] = useWrapperRef<string | undefined>(Props.modelValue?.[1]);
watch(
  modelValue,
  (newValues) => {
    const [start = '', end = ''] = newValues ?? [];
    // 自定义格式化
    if (typeof Props.showValueFormatter === 'function') {
      setShowValue(
        Props.showValueFormatter({
          startDate: start ? new Date(start) : undefined,
          endDate: end ? new Date(end) : undefined,
        }) || defaultShowValue
      );
    } else {
      const formatStartArr = start ? limitValueByColumnsType(start.split(dateValueDelimiter)) : [];
      const formatEndArr = end ? limitValueByColumnsType(end.split(dateValueDelimiter)) : [];
      const formatStartStr = formatStartArr.join(dateValueDelimiter);
      const formatEndStr = formatEndArr.join(dateValueDelimiter);
      setCurrentFormatedStartDate(formatStartStr);
      setCurrentFormatedEndDate(formatEndStr);
      // 更新 showValue
      const isEmpty = !formatStartStr && !formatEndStr;
      setShowValue(isEmpty ? defaultShowValue : `${formatStartStr} ${defaultShowDateRangeDelimiter} ${formatEndStr}`);
    }
  },
  { immediate: true }
);

// 格式化前的双向绑定值
const currentStartDate = computed<string[]>({
  get: () => {
    return currentFormatedStartDate.value ? currentFormatedStartDate.value.split(dateValueDelimiter) : [];
  },
  set: (val) => setCurrentFormatedStartDate(val.join(dateValueDelimiter)),
});
const currentEndDate = computed<string[]>({
  get: () => {
    return currentFormatedEndDate.value ? currentFormatedEndDate.value.split(dateValueDelimiter) : [];
  },
  set: (val) => setCurrentFormatedEndDate(val.join(dateValueDelimiter)),
});

const rangePickerRealtimeOptions = computed(() => [currentStartDate.value, currentEndDate.value]);

// 更新值处理
const updateModelFieldValue = (newValues: string[]) => {
  Emitter('update:modelValue', newValues);
};

// 根据时间大小自动矫正顺序
function correctingDateRange(range: [string, string]): [string, string] {
  const [d1, d2] = range.map((d) => dayjs(d));
  if (d1.isAfter(d2)) {
    return [range[1], range[0]];
  }
  return range;
}

// 确认选择
const onConfirmPicker = () => {
  const values = correctingDateRange([currentFormatedStartDate.value!, currentFormatedEndDate.value!]);
  if (Props.beforeConfirm) {
    const isSuccess = Props.beforeConfirm(values);
    if (!isSuccess) return;
  }
  Emitter('confirm', { values });
  updateModelFieldValue(values);
  setPopupShow(false);
};

defineExpose({
  setPickerRealtimeDate(p: TSetDRPickerRealtimeDatePayload) {
    const { start, end } = p;
    setCurrentFormatedStartDate(start);
    setCurrentFormatedEndDate(end);
  },
});
</script>

<style scoped lang="less">
// .vantkit-date-range-picker {
// }
</style>
