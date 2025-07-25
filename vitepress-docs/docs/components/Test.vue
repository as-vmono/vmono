<template>
  <div class="test-cpn-wrapper">
    <p>这是 cpn1.md 外部的 Test vue cpn</p>

    <section>
      <p>👇下面引入了工具包的组件 vant-kit</p>

      <SinglePicker
        v-model="pickerValue"
        :picker-props="{
          columns: [
            { name: 'Ashun', value: '1' },
            { name: 'astfn', value: '2' },
          ],
          columnsFieldNames: {
            text: 'name',
            value: 'value',
          },
        }"
        @confirm="
          ({ value }) => {
            issuingUnit = value;
          }
        "
      >
        <template #trigger="{ triggerPopupShow, showValue, selectedOption }">
          <slot
            name="trigger"
            :trigger-popup-show="triggerPopupShow"
            :show-value="showValue"
            :selected-option="selectedOption"
          >
            <div
              class="trigger-box"
              @click="
                () => {
                  triggerPopupShow();
                }
              "
            >
              Picker Trigger(click me)
            </div>
            <span>SinglePicker value: </span>
            <span>{{ showValue }}</span>
          </slot>
        </template>
      </SinglePicker>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { SinglePicker } from '@vmono-seed/vant-kit';
import { useWrapperRef } from '@vmono-seed/tools';
const pickerValue = useWrapperRef<string | undefined>(undefined);
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
      width: max-content;
      padding: 8px 10px;

      border: 1px solid;
      border-radius: 6px;
      cursor: pointer;
    }
  }
}
</style>
