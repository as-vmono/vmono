<template>
  <van-field v-bind="computedFieldProps" v-model="modelValue" />
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
