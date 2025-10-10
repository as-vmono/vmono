<template>
  <DateRangePicker
    ref="DateRangePickerRef"
    v-bind="Props"
    v-model="modelFieldValue"
    @update:model-value="(...args) => updateModelFieldValue(...args)"
    @confirm="(...args) => Emitter('confirm', ...args)"
  >
    <!-- 暴露默认支持的插槽 -->
    <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
      <slot :name="name" v-bind="slotData" :key="name"></slot>
    </template>

    <template #trigger="{ triggerPopupShow, showValue }">
      <van-field
        v-bind="computedFieldProps"
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
  </DateRangePicker>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { FieldProps } from 'vant';
import DateRangePicker, {
  TDateRangePickerConfirmPayload,
  TDateRangePickerProps,
} from '@/DateRangePicker/DateRangePicker.vue';
import { isNullOrUndefined } from '@vmono/utils';
import { useWrapperRef } from '@vmono/vhooks';
import { CommonFieldProps } from '@/common/constants';

const Props = defineProps<
  TDateRangePickerProps & {
    fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
  }
>();

const computedFieldProps = computed(() => {
  return { ...CommonFieldProps, ...(Props?.fieldProps ?? {}) };
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
  (e: 'confirm', p: TDateRangePickerConfirmPayload): void;
  (e: 'update:modelValue', value: TDateRangePickerProps['modelValue']): void;
}>();

const [modelFieldValue, setModelFieldValue] = useWrapperRef<any>(Props.modelValue ?? []);
watch(() => Props.modelValue, setModelFieldValue, { immediate: true });
const updateModelFieldValue = (newValue: any[] = []) => {
  setModelFieldValue(newValue);
  Emitter('update:modelValue', newValue);
};

const DateRangePickerRef = ref<InstanceType<typeof DateRangePicker>>();
defineExpose({
  setPickerRealtimeDate: computed(() => DateRangePickerRef.value?.setPickerRealtimeDate),
});
</script>

<style scoped lang="less">
.hidden {
  display: none;
}
</style>
