<template>
  <van-form ref="FormRef">
    <p>modelValue:{{ modelValue }}</p>
    <FieldDatePicker
      ref="FieldDatePickerRef"
      v-model="modelValue"
      :picker-props="{ title: '选择' }"
      :field-props="{
        name: 'dateField',
        label: 'FieldDatePicker',
        labelWidth: '12.5rem',
        readonly: false,
        required: true,
        rules: [{ required: true, message: '请选择' }],
      }"
      :show-value-formatter="(date) => date?.toLocaleDateString()"
    >
      <template #columns-top>
        <div class="columns-bar">
          <span>这里是 columns-top 插槽内容</span>
        </div>
      </template>
      <template #columns-bottom>
        <div class="columns-bar">
          <span>这里是 columns-bottom 插槽内容</span>
        </div>
      </template>
    </FieldDatePicker>

    <van-field
      v-model="testFieldModelValue"
      name="testField"
      label="testField"
      :rules="[{ required: true, message: '请选择' }]"
    ></van-field>
  </van-form>
  <van-space>
    <van-button
      type="primary"
      @click="
        () => {
          FormRef?.validate?.().finally(() => {
            console.log(FormRef?.getValues?.());
          });
        }
      "
    >
      验证表单
    </van-button>
    <van-button type="primary" @click="setPickerRealtimeDate"> 切换默认选中时间为当前日期 </van-button>
  </van-space>
</template>

<script lang="ts" setup>
import { useWrapperRef } from '@vmono/vhooks';
import { ref } from 'vue';
import { FieldDatePicker } from '@vmono/vant-kit';
import { Form as VanForm, Field as VanField, Button as VanButton, Space as VanSpace, FormInstance } from 'vant';
import dayjs from 'dayjs';

const FormRef = ref<FormInstance>();

const [modelValue] = useWrapperRef('');
const FieldDatePickerRef = ref<InstanceType<typeof FieldDatePicker>>();

const setPickerRealtimeDate = () => {
  FieldDatePickerRef.value?.setPickerRealtimeDate?.(dayjs().format('YYYY-MM-DD'));
};

const [testFieldModelValue] = useWrapperRef('');
</script>

<style scoped lang="less">
.trigger-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.columns-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
