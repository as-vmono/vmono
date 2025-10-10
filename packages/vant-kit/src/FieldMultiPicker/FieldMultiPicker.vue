<template>
  <MultiPicker
    ref="MultiPickerRef"
    v-bind="Props"
    :show-search="showSearch"
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
      />
    </template>
  </MultiPicker>
</template>

<script lang="ts" setup>
import { CommonFieldProps } from '@/common/constants';
import MultiPicker, { TConfirmEventPayload, TMultiPickerProps } from '@/MultiPicker/MultiPicker.vue';
import { isNullOrUndefined } from '@vmono/utils';
import { useWrapperRef } from '@vmono/vhooks';
import type { FieldProps } from 'vant';
import { computed, ref, watch } from 'vue';

const Props = defineProps<
  TMultiPickerProps & {
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
});
</script>

<style scoped lang="less">
.hidden {
  display: none;
}
</style>
