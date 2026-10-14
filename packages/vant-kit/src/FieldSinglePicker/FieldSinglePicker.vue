<template>
  <SinglePicker
    ref="SinglePickerRef"
    v-bind="computedSinglePickerProps"
    v-model="modelFieldValue"
    @update:model-value="(...args) => updateModelFieldValue(...args)"
    @search="(...args) => Emitter('search', ...args)"
    @confirm="(...args) => Emitter('confirm', ...args)"
    @confirmDisabledOption="(...args) => Emitter('confirmDisabledOption', ...args)"
  >
    <!-- 暴露默认支持插槽 -->
    <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
      <slot :name="name" v-bind="{ ...slotData, key: name }"></slot>
    </template>

    <template #trigger="{ triggerPopupShow, showValue }">
      <van-field class="hidden" v-bind="computedFieldProps" v-model="modelFieldValue" :is-link="isLink" />
      <van-field
        v-bind="computedFieldProps"
        :is-link="isLink"
        readonly
        :name="undefined"
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
  </SinglePicker>
</template>

<script lang="ts">
export type TFieldSinglePickerProps = TSinglePickerProps & {
  fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
};
</script>

<script lang="ts" setup>
import { CommonFieldProps } from '@/common/constants';
import SinglePicker, { TSinglePickerProps, TSPConfirmDisabledOptionPayload } from '@/SinglePicker/SinglePicker.vue';
import { isNullOrUndefined } from '@vmono/utils';
import { useWrapperRef } from '@vmono/vhooks';
import type { FieldProps } from 'vant';
import { computed, ref, watch } from 'vue';

const Props = defineProps<TFieldSinglePickerProps>();

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

const computedSinglePickerProps = computed((): TSinglePickerProps => {
  const singlePickerProps = { ...(Props ?? {}) };
  delete (singlePickerProps as any).fieldProps;
  return singlePickerProps;
});

const Emitter = defineEmits<{
  (e: 'search', value: string): void;
  (e: 'confirm', option: any): void;
  (e: 'confirmDisabledOption', p: TSPConfirmDisabledOptionPayload): void;
  (e: 'update:modelValue', value: any);
}>();

const [modelFieldValue, setModelFieldValue] = useWrapperRef<any>(Props.modelValue);
watch(() => Props.modelValue, setModelFieldValue, { immediate: true });
const updateModelFieldValue = (newValue) => {
  setModelFieldValue(newValue);
  // console.log('updateModelFieldValue');
  Emitter('update:modelValue', newValue);
};

const SinglePickerRef = ref<InstanceType<typeof SinglePicker>>();
defineExpose({
  handleCancel: computed(() => SinglePickerRef.value?.handleCancel),
});
</script>

<style scoped lang="less">
.hidden {
  display: none;
}
</style>
