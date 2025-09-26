<template>
  <van-form ref="FormRef">
    modelValue: {{ pickerValue }}
    <FieldSinglePicker
      v-model="pickerValue"
      :field-props="{
        name: 'singlePicker',
        label: '单选',
        placeholder: '请选择',
        required: true,
        rules: [{ required: true, message: '请选择' }],
      }"
      :picker-props="{
        title: '基础用法',
        columns: columns,
        columnsFieldNames: columnsFieldNames,
      }"
    >
      <template #columns-top>
        <div class="desc">这就是基础组件 - SinglePicker</div>
      </template>
    </FieldSinglePicker>
    <van-button round block type="primary" @click="handleSubmit"> 提交 </van-button>
  </van-form>
</template>

<script setup lang="ts">
import { useWrapperRef } from '@vmono/vhooks';
import { FieldSinglePicker } from '@vmono/vant-kit';
import { Form as VanForm, Button as VanButton, FormInstance } from 'vant';
import { ref } from 'vue';

const FormRef = ref<FormInstance>();
const handleSubmit = () => {
  FormRef.value?.validate().then(() => {
    // eslint-disable-next-line no-console
    console.log('submit', FormRef.value?.getValues?.());
  });
};

const columns = [
  { name: '选项1', value: '1' },
  { name: '选项2', value: '2' },
];
const columnsFieldNames = {
  text: 'name',
  value: 'value',
};
const [pickerValue, _setPickerValue] = useWrapperRef<string | undefined>(undefined);
</script>

<style scoped lang="less">
.desc {
  font-size: 12px;
  text-align: center;
}
</style>
