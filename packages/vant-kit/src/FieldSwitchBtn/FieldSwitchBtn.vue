<!-- components/FieldSwitchBtn.vue -->
<template>
  <div class="field-switch-btn-wrapper">
    <!-- 隐藏字段，用于表单提交 -->
    <van-field class="hidden" v-bind="computedFieldProps" v-model="modelFieldValue" />
    <div class="field-switch-btn-show-content">
      <!-- 显示按钮组 -->
      <van-field v-bind="computedFieldProps" :name="undefined" readonly v-model="showValue">
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
import { FieldProps } from 'vant';
import { computed } from 'vue';

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
const modelFieldValue = computed({
  get: () => Props.modelValue,
  set: (val) => updateModelValue(val),
});
const setModelFieldValue = (newValue: any) => {
  modelFieldValue.value = newValue;
};

const handleChange = (newValue: any) => {
  if (isViewMode.value || newValue === Props.modelValue) return;
  setModelFieldValue(newValue);
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
