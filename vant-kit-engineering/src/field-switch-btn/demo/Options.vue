<template>
  <demo-block title="自定义 Options">
    <van-form ref="FormRef" :validate-trigger="['onBlur', 'onChange']">
      <section>
        <p>filedValue: {{ filedValue }}</p>
        <FieldSwitchBtn
          v-model="filedValue"
          :options="options.genOptions() as any"
          :field-props="{
            name: 'validityPeriodField',
            label: '证件有效期',
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
import { asEnum } from 'as-enum';
import { Form as VanForm, Button as VanButton, FormInstance } from 'vant';
import { ref } from 'vue';

const options = asEnum([['非长期'], ['长期']] as const);

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
