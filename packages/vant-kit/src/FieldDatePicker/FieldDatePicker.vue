<template>
  <DatePicker
    ref="DatePickerRef"
    v-model="modelFieldValue"
    @update:model-value="(...args) => updateModelFieldValue(...args)"
    :picker-props="pickerProps"
    :show-value-formatter="showValueFormatter"
    @confirm="(...args) => Emitter('confirm', ...args)"
  >
    <!-- 暴露所有插槽 -->
    <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
      <slot :name="name" v-bind="slotData" :key="name"></slot>
    </template>

    <template #trigger="{ triggerPopupShow, showValue }">
      <!-- 隐藏原生字段用于绑定值 -->
      <van-field class="hidden" v-bind="computedFieldProps" v-model="modelFieldValue" :is-link="isLink" />
      <!-- 展示格式化后的日期字段 -->
      <van-field
        v-bind="computedFieldProps"
        :name="undefined"
        :is-link="isLink"
        readonly
        v-model="showValue!"
        @click="
          () => {
            if (isViewMode) return;
            triggerPopupShow();
          }
        "
      />
    </template>
  </DatePicker>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { FieldProps } from 'vant';
import { useWrapperRef } from '@vmono/vhooks';
import DatePicker, { TDatePickerConfirmPayload, TDatePickerProps } from '../DatePicker/DatePicker.vue';
import { isNullOrUndefined } from '@vmono/utils';

const Props = defineProps<
  TDatePickerProps & {
    fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
  }
>();

const computedFieldProps = computed(() => {
  const defaultProps: typeof Props.fieldProps = {
    inputAlign: 'right',
    errorMessageAlign: 'right',
  };
  return Object.assign(Props?.fieldProps ?? {}, defaultProps);
});
const isViewMode = computed(() => computedFieldProps.value?.readonly || computedFieldProps.value?.disabled || false);
const isLink = computed(() => {
  if (isNullOrUndefined(computedFieldProps.value?.isLink)) {
    return !isViewMode.value;
  } else {
    return computedFieldProps.value?.isLink;
  }
});

const Emitter = defineEmits<{
  (e: 'confirm', option: TDatePickerConfirmPayload): void;
  (e: 'update:modelValue', value: string);
}>();

const [modelFieldValue, setModelFieldValue] = useWrapperRef<any>(Props.modelValue);
watch(() => Props.modelValue, setModelFieldValue, { immediate: true });
const updateModelFieldValue = (newValue) => {
  setModelFieldValue(newValue);
  // console.log('updateModelFieldValue');
  Emitter('update:modelValue', newValue);
};

const DatePickerRef = ref<InstanceType<typeof DatePicker>>();
defineExpose({
  setPickerRealtimeDate: DatePickerRef?.value?.setPickerRealtimeDate,
});
</script>

<style scoped lang="less">
.hidden {
  display: none;
}
</style>
