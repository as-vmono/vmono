<template>
  <slot
    :show-value="showValue"
    :loading="fetchPlaintextLoading"
    :is-plaintext-visible="isPlaintextVisible"
    :toggle-visibility="toggleVisibility"
  >
    <div class="mask-txt-wrapper">
      <span>{{ showValue }}</span>
      <div class="view-mode-tool">
        <van-icon
          v-if="!fetchPlaintextLoading"
          :size="iconSize"
          :name="isPlaintextVisible ? 'eye-o' : 'closed-eye'"
          @click="toggleVisibility"
        />
        <van-loading v-else :size="iconSize" type="spinner" />
      </div>
    </div>
  </slot>
</template>

<script lang="ts">
export type TMaskTxtProps = {
  maskId: string;
  maskTxt: string;
  iconSize?: string | number;
  preset: Omit<IUseMaskedFieldOptions, 'maskId' | 'modelValue' | 'onValueUpdate'>;
};
</script>

<script lang="ts" setup>
import { useMaskedField, IUseMaskedFieldOptions } from '@/common';
import { computed } from 'vue';

const Props = withDefaults(defineProps<TMaskTxtProps>(), {
  iconSize: 16,
});

const { showValue, fetchPlaintextLoading, isPlaintextVisible, toggleVisibility } = useMaskedField({
  ...Props.preset,
  maskId: computed(() => Props.maskId),
  modelValue: computed(() => Props.maskTxt),
});
</script>

<style scoped lang="less">
.mask-txt-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
