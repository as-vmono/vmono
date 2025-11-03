<template>
  <van-form ref="FormRef">
    <span @click="getIdMapData">modelValue: {{ pickerValue }}</span>
    <FieldMultiPicker
      ref="FieldMultiPickerRef"
      v-model="pickerValue"
      :options="options"
      :field-names="fieldNames"
      title="基础用法"
      tip-txt="这就是基础组件 - MultiPicke"
      :field-props="{
        name: 'multiPicker',
        label: '多选',
        placeholder: '请选择',
        required: true,
        rules: [{ required: true, message: '请选择' }],
      }"
      :processing-fallback-show-value="processingFallbackShowValue"
    />
    <van-button round block type="primary" @click="handleSubmit"> 提交 </van-button>
  </van-form>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { FieldMultiPicker } from '@vmono/vant-kit';
import { ref } from 'vue';
import { Form as VanForm, Button as VanButton, FormInstance } from 'vant';

const FormRef = ref<FormInstance>();
const handleSubmit = () => {
  FormRef.value?.validate().then(() => {
    // eslint-disable-next-line no-console
    console.log('getValues', FormRef.value?.getValues?.());
    // eslint-disable-next-line no-console
    console.log('真实值', { multiPicker: pickerValue.value });
  });
};

const options = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2', disabled: true },
  { name: '选项3', value: '3' },
];
const defaultSelectedOptions = [options?.[2], { name: '选项4', value: '4' }];

const fieldNames = {
  label: 'name',
  value: 'value',
};
const [pickerValue, _setPickerValue] = useWrapperRef<string[]>(defaultSelectedOptions.map((item) => item.value));

const FieldMultiPickerRef = ref<InstanceType<typeof FieldMultiPicker>>();
const getIdMapData = () => {
  // eslint-disable-next-line no-console
  console.log('getIdMapData', FieldMultiPickerRef.value?.getOptionsIdMapData?.());
};

const processingFallbackShowValue = () => {
  return defaultSelectedOptions.map((item) => item.name);
};
</script>

<style scoped lang="less">
.desc {
  font-size: 12px;
  text-align: center;
}
</style>
