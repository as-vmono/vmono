<template>
  <div class="test-cpn-wrapper">
    <p>这是 cpn1.md 外部的 Test vue cpn</p>

    <section>
      <p>👇下面引入了工具包的组件 cpn-kit</p>

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
              <p @click="triggerPopupShow">Picker Trigger(click me)🤪</p>
              <span>SinglePicker value: {{ showValue }}</span>
            </div>
          </slot>
        </template>
      </SinglePicker>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { SinglePicker } from '@vmono-seed/cpn-kit';
import { useWrapperRef } from '@vmono-seed/tools';

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
.test-cpn-wrapper {
  padding: 12px;
  border: 1px solid;
  border-radius: 6px;

  section {
    padding: 20px;
    border: 1px solid skyblue;
    border-radius: 6px;

    .trigger-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        padding: 8px;
        cursor: pointer;
        border-radius: 5px;
        color: #fff;
        background-color: #1989fa;
      }
    }
  }
}
</style>
