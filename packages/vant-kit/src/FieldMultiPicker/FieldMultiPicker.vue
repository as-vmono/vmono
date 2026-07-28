<template>
  <MultiPicker
    v-bind="computedMultiPickerProps"
    ref="MultiPickerRef"
    v-model="modelFieldValue"
    @update:model-value="(...args) => updateModelFieldValue(...args)"
    @search="(...args) => Emitter('search', ...args)"
    @toggleCheckbox="(...args) => Emitter('toggleCheckbox', ...args)"
    @confirm="(...args) => Emitter('confirm', ...args)"
  >
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
      >
        <!-- field 组件插槽暴露 -->
        <template v-if="$slots['field-label']" #label>
          <slot name="field-label" />
        </template>
        <template v-if="$slots['field-input']" #input>
          <slot name="field-input" />
        </template>
        <template v-if="$slots['field-left-icon']" #left-icon>
          <slot name="field-left-icon" />
        </template>
        <template v-if="$slots['field-right-icon']" #right-icon>
          <slot name="field-right-icon" />
        </template>
        <template v-if="$slots['field-button']" #button>
          <slot name="field-button" />
        </template>
        <template v-if="$slots['field-extra']" #extra>
          <slot name="field-extra" />
        </template>
        <template v-if="$slots['field-error-message']" #error-message>
          <slot name="field-error-message" />
        </template>
      </van-field>
    </template>
  </MultiPicker>
</template>

<script lang="ts">
export type TFieldMultiPickerProps = TMultiPickerProps & {
  fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
};
</script>

<script lang="ts" setup>
import { CommonFieldProps } from '@/common/constants';
import MultiPicker, { TConfirmEventPayload, TMultiPickerProps } from '@/MultiPicker/MultiPicker.vue';
import { isNullOrUndefined } from '@vmono/utils';
import { useWrapperRef } from '@vmono/vhooks';
import type { FieldProps } from 'vant';
import { computed, ref, watch } from 'vue';

const Props = defineProps<TFieldMultiPickerProps>();

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

const computedMultiPickerProps = computed((): TMultiPickerProps => {
  const multiPickerProps = { ...(Props ?? {}) };
  delete (multiPickerProps as any).fieldProps;
  return multiPickerProps;
});

const Emitter = defineEmits<{
  (e: 'search', value: string): void;
  (e: 'toggleCheckbox', value: any[]): void;
  (e: 'confirm', p: TConfirmEventPayload): void;
  (e: 'update:modelValue', value: any[]);
}>();

const [modelFieldValue, setModelFieldValue] = useWrapperRef<any>(Props.modelValue ?? []);
watch(() => Props.modelValue, setModelFieldValue, { immediate: true });
const updateModelFieldValue = (newValue: any[] = []) => {
  setModelFieldValue(newValue);
  // console.log('updateModelFieldValue');
  Emitter('update:modelValue', newValue);
};

const MultiPickerRef = ref<InstanceType<typeof MultiPicker>>();
defineExpose({
  getOptionsIdMapData: computed(() => MultiPickerRef.value?.getOptionsIdMapData),
  handleCancel: computed(() => MultiPickerRef.value?.handleCancel),
});
</script>

<style scoped lang="less">
.hidden {
  display: none;
}
</style>
