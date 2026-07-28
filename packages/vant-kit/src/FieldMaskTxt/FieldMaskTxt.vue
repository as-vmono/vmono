<!-- components/FieldMaskTxt.vue -->
<template>
  <div class="field-mask-txt-wrapper">
    <!-- 虚拟 field，用于真实值绑定 -->
    <van-field class="hidden" v-bind="computedRealFieldProps" v-model="modelFieldValue" />
    <div class="field-mask-txt-show-content">
      <!-- 展示用 field -->
      <van-field
        v-bind="computedFieldProps"
        :readonly="readonly"
        :name="undefined"
        v-model="showFieldValue"
        @input="onInput"
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
        <template v-if="$slots['field-button']" #button>
          <slot name="field-button" />
        </template>
        <template v-if="$slots['field-extra']" #extra>
          <slot name="field-extra" />
        </template>
        <template v-if="$slots['field-error-message']" #error-message>
          <slot name="field-error-message" />
        </template>
        <!-- #right-icon 插槽不暴露：小眼睛图标是核心功能 -->
        <template #right-icon>
          <!-- 不可编辑态：前端或后端脱敏 -->
          <section v-if="notEditableOriginPreset">
            <div class="view-trigger" v-if="!isPlaintextVisible">
              <van-icon v-if="!fetchPlaintextLoading" name="closed-eye" @click="revealPlaintext" />
              <van-loading v-else size="16" type="spinner" />
            </div>
          </section>
          <!-- 可编辑态：点击小眼睛后进入编辑 -->
          <section v-else>
            <div class="view-trigger" v-if="!isPlaintextVisible">
              <van-icon v-if="!fetchPlaintextLoading" name="closed-eye" @click="revealPlaintext" />
              <van-loading v-else size="16" type="spinner" />
            </div>
          </section>
          <van-loading v-if="notEditableOriginPreset && loading" size="16" type="spinner" />
        </template>
      </van-field>
    </div>
  </div>
</template>

<script lang="ts">
export type TFieldMaskTxtProps = {
  hideEyeIcon?: boolean;
  maskId: string;
  modelValue: any;
  fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
  genFieldRules?: (p: { isPlaintextVisible: boolean }) => FieldProps['rules'];
  realFieldProps?: Partial<Omit<FieldProps, 'modelValue'>>;
  loading?: boolean;
  preset: Omit<IUseMaskedFieldOptions, 'maskId' | 'modelValue' | 'onValueUpdate'>;
};
</script>

<script lang="ts" setup>
import { useMaskedField, IUseMaskedFieldOptions } from '@/common';
import { CommonFieldProps } from '@/common/constants';
import { useWrapperRef } from '@vmono/vhooks';

import { FieldProps } from 'vant';
import { computed, watch } from 'vue';

const Props = withDefaults(defineProps<TFieldMaskTxtProps>(), {
  hideEyeIcon: false,
  genFieldRules: () => [],
  realFieldProps: () => ({}),
  loading: false,
});

// === 使用 useMaskedField 封装核心脱敏逻辑 ===
const {
  showValue,
  isPlaintextVisible,
  setIsPlaintextVisible,
  fetchPlaintextLoading,
  revealPlaintext,
  updateModelValue,
} = useMaskedField({
  ...Props.preset,
  maskId: computed(() => Props.maskId),
  modelValue: computed(() => Props.modelValue),
});
watch(() => Props.hideEyeIcon, setIsPlaintextVisible, { immediate: true });

const [showFieldValue, setShowFieldValue] = useWrapperRef(showValue.value);
watch(showValue, setShowFieldValue);

/**
 * computed Props
 */
const computedFieldProps = computed(() => {
  const genFieldRulesRes = Props?.genFieldRules({ isPlaintextVisible: isPlaintextVisible.value });
  const rules = (genFieldRulesRes?.length ? genFieldRulesRes : Props?.fieldProps?.rules) ?? [];
  return { ...CommonFieldProps, ...(Props?.fieldProps ?? {}), rules };
});

const computedRealFieldProps = computed(() => {
  return { ...(computedFieldProps.value ?? {}), ...(Props.realFieldProps ?? {}) };
});

// disabled 👇
const fieldDisabled = computed(() => {
  return Props.fieldProps?.disabled || false;
});

// readonly 👇
// readonly原始设定值
const fieldReadonly = computed(() => {
  return Props.fieldProps?.readonly || false;
});
// 是否为不可编辑状态的原始设定值（disabled 或 readonly）
const notEditableOriginPreset = computed(() => {
  return fieldDisabled.value || fieldReadonly.value;
});
// 最终计算的 readonly (不可编辑态 或 脱敏显示)
const readonly = computed(() => {
  return notEditableOriginPreset.value || !isPlaintextVisible.value;
});

const Emitter = defineEmits<{
  (e: 'update:modelValue', value: any);
}>();

/**
 * 真实值
 *  * 初始值为加密且脱敏的源数据
 *  * 也可以是编辑后的未脱敏加密数据
 */
const [modelFieldValue, setModelFieldValue] = useWrapperRef<any>(Props.modelValue);
watch(() => Props.modelValue, setModelFieldValue);
const updateModelFieldValue = (newValue) => {
  setModelFieldValue(newValue);
  Emitter('update:modelValue', newValue);
};

const onInput = (e: InputEvent) => {
  const inputValue = (e.target as any)?.value as string;
  updateModelValue(inputValue);
  updateModelFieldValue(Props.preset.encrypt?.(inputValue?.trim?.() ?? ''));
};
</script>

<style scoped lang="less">
.field-mask-txt-wrapper {
  width: 100%;
  background-color: var(--van-cell-background);
}

.field-mask-txt-show-content {
  width: 100%;
  display: flex;
  align-items: center;

  .view-trigger {
    color: unset;
  }
}

.hidden {
  display: none;
}
</style>
