<template>
  <demo-block title="基础用法">
    <van-form ref="FormRef" :validate-trigger="['onBlur', 'onChange']">
      <section>
        <p>filedValue({{ typeof filedValue }}): {{ filedValue }}</p>
        <FieldSwitchBtn
          v-model="filedValue"
          :field-props="{
            name: 'testField',
            label: '测试字段',
            required: true,
            rules: [{ required: true, message: '请选择' }],
          }"
        />
      </section>
      <van-button round block type="primary" @click="handleSubmit"> 提交 </van-button>
    </van-form>
  </demo-block>
</template>

<script setup lang="ts">
import { FieldSwitchBtn } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Form as VanForm, Button as VanButton, FormInstance } from 'vant';
import { ref } from 'vue';

/**
 * 表单逻辑
 */
const [filedValue] = useWrapperRef<any>(undefined);

const FormRef = ref<FormInstance>();
const handleSubmit = () => {
  FormRef.value?.validate().then(() => {
    // eslint-disable-next-line no-console
    console.log('getValues', FormRef.value?.getValues?.());
  });
};
</script>

<style scoped lang="less">
section {
  padding: 0px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;

  .desc {
    font-size: 12px;
    align-self: flex-start;
    color: #aaa;
  }
}
</style>
