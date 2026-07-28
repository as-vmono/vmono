<!-- components/FieldSwitchBtn.vue -->
<template>
  <div class="field-switch-btn-wrapper">
    <!-- 隐藏字段，用于表单提交 -->
    <van-field class="hidden" v-bind="computedFieldProps" v-model="modelFieldValue" />
    <div class="field-switch-btn-show-content">
      <!-- 显示按钮组 -->
      <van-field v-bind="computedFieldProps" :name="undefined" readonly v-model="showValue">
        <!-- field 组件插槽暴露 -->
        <template v-if="$slots['field-label']" #label>
          <slot name="field-label" />
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
        <!-- #input 插槽不暴露：按钮组是核心功能 -->
        <template #input>
          <div class="field-switch-btns-container">
            <section
              v-for="option in computedOptions"
              :key="option.value"
              :class="[
                'field-switch-btn',
                { 'field-switch-btn-selected': modelFieldValue == option.value },
                { 'field-switch-btn-disabled': isViewMode && modelFieldValue != option.value },
              ]"
              @click="handleChange(option.value)"
            >
              {{ option.label }}
            </section>
          </div>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script lang="ts">
export type TSwitchOption = { label: string; value: any };
export type TSwitchOptions = [TSwitchOption, TSwitchOption];
export type TFieldSwitchBtnProps = {
  modelValue: any;
  fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
  options?: TSwitchOptions;
};

const defaultOptions: TSwitchOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];
</script>

<script lang="ts" setup>
import { CommonFieldProps } from '@/common/constants';
import { useWrapperRef } from '@vmono/vhooks';
import { FieldProps } from 'vant';
import { computed, watch } from 'vue';

const Props = defineProps<TFieldSwitchBtnProps>();

const computedFieldProps = computed(() => {
  return { ...CommonFieldProps, ...(Props?.fieldProps ?? {}) };
});

const computedOptions = computed(() => Props.options || defaultOptions);

const isViewMode = computed(() => computedFieldProps.value?.readonly || computedFieldProps.value?.disabled || false);

const getOptByValue = (opts: TSwitchOptions, value: any) => {
  return opts.find((opt) => opt.value == value);
};

const Emitter = defineEmits<{
  (e: 'change', option: TSwitchOption): void;
  (e: 'update:modelValue', value: any): void;
}>();

// 双向绑定
const updateModelValue = (newValue: any) => {
  Emitter('update:modelValue', newValue);
  const option = getOptByValue(computedOptions.value, newValue)!;
  Emitter('change', option);
};

const [modelFieldValue, setModelFieldValue] = useWrapperRef<any>(Props.modelValue);
watch(() => Props.modelValue, setModelFieldValue, { immediate: true });

const handleChange = (newValue: any) => {
  if (isViewMode.value || newValue === Props.modelValue) return;
  updateModelValue(newValue);
};

// 用于展示的表单值
const showValue = computed({
  get() {
    return getOptByValue(computedOptions.value, modelFieldValue.value)?.value;
  },
  set() {},
});
</script>

<style scoped lang="less">
.field-switch-btn-wrapper {
  width: 100%;
  background-color: var(--van-cell-background);
}

.field-switch-btn-show-content {
  width: 100%;
  display: flex;

  .field-switch-btns-container {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }

  .field-switch-btn {
    padding: 1px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border: 1px solid var(--van-button-primary-background);
    border-radius: 4px;
    color: var(--van-button-primary-background);
    background: #fff;
    font-size: 14px;
    cursor: pointer;
  }

  .field-switch-btn-selected {
    color: #fff;
    background: var(--van-button-primary-background);
  }

  .field-switch-btn-disabled {
    color: #999;
    border-color: rgba(153, 153, 153, 0.2);
    background: rgba(153, 153, 153, 0.2);
    cursor: not-allowed;
  }
}

.hidden {
  display: none;
}
</style>
