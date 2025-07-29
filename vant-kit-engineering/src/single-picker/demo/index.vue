<template>
  <SinglePicker
    v-model="pickerValue"
    :picker-props="{
      columns: columns,
      columnsFieldNames: columnsFieldNames,
    }"
    @confirm="({ value }) => setPickerValue(value)"
  >
    <template #trigger="{ triggerPopupShow, showValue, selectedOption }">
      <slot
        name="trigger"
        :trigger-popup-show="triggerPopupShow"
        :show-value="showValue"
        :selected-option="selectedOption"
      >
        <div class="trigger-box">
          <van-button type="primary" @click="triggerPopupShow"> Picker Trigger(click me)🤪 </van-button>
          <span>SinglePicker value: {{ showValue }}</span>
        </div>
      </slot>
    </template>
  </SinglePicker>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono-seed/tools';
import SinglePicker from '../index.vue';
import { Button as VanButton } from 'vant';

const columns = [
  { name: 'Ashun', value: '1' },
  { name: 'astfn', value: '2' },
];
const columnsFieldNames = {
  text: 'name',
  value: 'value',
};

const [pickerValue, setPickerValue] = useWrapperRef<string | undefined>(undefined);
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
