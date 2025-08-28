<template>
  <SinglePicker
    v-model="modelFieldValue"
    @update:model-value="(...args) => updateModelFieldValue(...args)"
    :picker-props="pickerProps"
    :show-search="showSearch"
    @search="(...args) => Emitter('search', ...args)"
    @confirm="(...args) => Emitter('confirm', ...args)"
    @confirmDisabledOption="(...args) => Emitter('confirmDisabledOption', ...args)"
  >
    <!-- 暴露默认支持插槽 -->
    <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
      <slot :name="name" v-bind="slotData" :key="name"></slot>
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
      />
    </template>
  </SinglePicker>
</template>

<script lang="ts">
export default {
  name: 'FieldSinglePicker',
};
</script>

<script lang="ts" setup>
import SinglePicker, { TSinglePickerProps, TConfirmDisabledOptionPayload } from '../single-picker/index.vue';
import { Field as VanField } from 'vant';
import { isNullOrUndefined } from '@vmono/utils';
import { useWrapperRef } from '@vmono/vhooks';
import type { FieldProps } from 'vant';
import { computed, watch } from 'vue';

const Props = withDefaults(
  defineProps<
    TSinglePickerProps & {
      fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
    }
  >(),
  {
    showSearch: false,
  }
);

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
  (e: 'search', value: string): void;
  (e: 'confirm', option: any): void;
  (e: 'confirmDisabledOption', p: TConfirmDisabledOptionPayload): void;
  (e: 'update:modelValue', value: any);
}>();

const [modelFieldValue, setModelFieldValue] = useWrapperRef<any>(Props.modelValue);
watch(() => Props.modelValue, setModelFieldValue, { immediate: true });
const updateModelFieldValue = (newValue) => {
  setModelFieldValue(newValue);
  // console.log('updateModelFieldValue');
  Emitter('update:modelValue', newValue);
};

defineExpose({});
</script>

<style scoped lang="less">
.hidden {
  display: none;
}
</style>
