<template>
  <div>
    <SinglePicker
      v-model="modelFieldValue"
      @update:model-value="(v) => updateModelFieldValue(v)"
      :picker-props="pickerProps"
      :show-search="showSearch"
      @search="(v) => Emitter('search', v)"
      @confirm="(v) => Emitter('confirm', v)"
    >
      <template #trigger="{ triggerPopupShow, showValue }">
        <van-field class="hidden" v-bind="fieldProps" v-model="modelFieldValue" :is-link="isLink" />
        <van-field
          v-bind="fieldProps"
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
  </div>
</template>

<script lang="ts" setup>
import type { FieldProps, PickerProps } from 'vant';
import { computed, watch } from 'vue';
import { isNullOrUndefined, useWrapperRef } from '@vmono-seed/tools';

const Props = withDefaults(
  defineProps<{
    showSearch?: boolean;
    modelValue: any;
    fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
    pickerProps: Partial<PickerProps>;
  }>(),
  {
    showSearch: false,
  }
);

const isViewMode = computed(() => Props?.fieldProps?.readonly || Props?.fieldProps?.disabled || false);
const isLink = computed(() => {
  if (isNullOrUndefined(Props?.fieldProps?.isLink)) {
    return !isViewMode.value;
  } else {
    return Props?.fieldProps?.isLink;
  }
});

const Emitter = defineEmits<{
  (e: 'search', value: string): void;
  (e: 'confirm', value: any): void;
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
:deep(.van-search) {
  width: 250px;
}
.hidden {
  display: none;
}
</style>
