<template>
  <van-field v-bind="computedFieldProps" v-model="modelValue">
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

<script lang="ts">
export type TFieldTextareaProps = {
  fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
};
</script>

<script lang="ts" setup>
import { CommonFieldProps } from '@/common';
import { isNullOrUndefined } from '@vmono/utils';
import { FieldProps } from 'vant';
import { computed } from 'vue';

const Props = defineProps<TFieldTextareaProps>();

const modelValue = defineModel<string>();

const computedFieldProps = computed(() => {
  const fieldProps = Props?.fieldProps;
  const computedShowWordLimitByMaxlength = !isNullOrUndefined(fieldProps?.maxlength);
  return {
    ...CommonFieldProps,
    rows: '2',
    labelAlign: 'top',
    ...((fieldProps ?? {}) as any),
    type: 'textarea',
    showWordLimit: fieldProps?.showWordLimit ?? computedShowWordLimitByMaxlength,
  } as TFieldTextareaProps;
});
</script>

<style scoped lang="less">
:deep(.van-field__label--top) {
  margin-bottom: 12px;
}
:deep(.van-field__value) {
  background-color: #f8f8f8;
  border-radius: 6px;
  padding: 6px 16px;
}
</style>
