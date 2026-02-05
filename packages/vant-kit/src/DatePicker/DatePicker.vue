<template>
  <div class="vantkit-date-picker">
    <slot
      name="trigger"
      :trigger-popup-show="triggerPopupShow"
      :show-value="showValue"
      :picker-realtime-options="pickerRealtimeOptions"
    >
    </slot>

    <!-- 日期选择弹窗 -->
    <van-popup v-bind="computedPopupProps" v-model:show="popupShow">
      <van-date-picker
        v-bind="computedPickerProps"
        v-model="pickerRealtimeOptions"
        @confirm="onConfirmPicker"
        @cancel="handleCancel"
      >
        <!-- 暴露默认支持的插槽 -->
        <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
          <slot :name="name" v-bind="slotData" :key="name"></slot>
        </template>
      </van-date-picker>
    </van-popup>
  </div>
</template>

<script lang="ts">
const defaultShowValue = '';
const dateValueDelimiter = '-';

export type TDatePickerConfirmPayload = {
  selectedValues: string[];
  selectedOptions: Array<{ text: string; value: string }>;
  selectedIndexes: number[];
};

export type TDatePickerProps = {
  modelValue: string | undefined;
  pickerProps?: Partial<DatePickerProps>;
  popupProps?: Partial<PopupProps>;
  showValueFormatter?: (date?: Date) => string | undefined;
};
</script>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import type { DatePickerProps, PopupProps } from 'vant';
import { useWrapperRef } from '@vmono/vhooks';

const Props = defineProps<TDatePickerProps>();

const computedPopupProps = computed(() => {
  return { position: 'bottom', round: true, ...((Props.popupProps ?? {}) as any) } as PopupProps;
});

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
  return { ...pickerProps, formatter };
});

const Emitter = defineEmits<{
  (e: 'confirm', option: TDatePickerConfirmPayload): void;
  (e: 'update:modelValue', value: string);
}>();

// 控制弹窗显示
const [popupShow, setPopupShow] = useWrapperRef<boolean>(false);
const triggerPopupShow = () => {
  setPopupShow(true);
};

const handleCancel = () => {
  setPopupShow(false);
};

// 真实绑定的选项值
const [modelValue, setModelValue] = useWrapperRef<string | undefined>(Props.modelValue);
watch(
  () => Props.modelValue,
  (newValue) => {
    setModelValue(newValue);
  },
  { immediate: true }
);

// 显示值处理
const [showValue, setShowValue] = useWrapperRef<string>(defaultShowValue);
watch(
  modelValue,
  (_newValue) => {
    // 自定义格式化
    if (typeof Props.showValueFormatter === 'function') {
      setShowValue(
        Props.showValueFormatter(modelValue.value ? new Date(modelValue.value) : undefined) || defaultShowValue
      );
    } else {
      setShowValue(_newValue || defaultShowValue);
    }
  },
  { immediate: true }
);

/**
 * picker 实时选中的日期值
 * */
// 格式化后的值
const [pickerRealtimeDate, setPickerRealtimeDate] = useWrapperRef<string | undefined>(Props.modelValue);
watch(
  modelValue,
  (_newValue) => {
    setPickerRealtimeDate(_newValue || '');
  },
  { immediate: true }
);
// 格式化前的双向绑定值
const pickerRealtimeOptions = computed<string[]>({
  get: () => {
    return pickerRealtimeDate.value ? pickerRealtimeDate.value.split(dateValueDelimiter) : [];
  },
  set: (val) => setPickerRealtimeDate(val.join(dateValueDelimiter)),
});

// 更新值处理
const updateModelFieldValue = (p: TDatePickerConfirmPayload) => {
  const { selectedValues } = p;
  Emitter('update:modelValue', selectedValues.join(dateValueDelimiter));
};

// 确认选择
const onConfirmPicker = (p: TDatePickerConfirmPayload) => {
  Emitter('confirm', p);
  updateModelFieldValue(p);
  handleCancel();
};

defineExpose({
  setPickerRealtimeDate,
  handleCancel,
});
</script>

<style scoped lang="less">
// .vantkit-date-picker {
// }
</style>
