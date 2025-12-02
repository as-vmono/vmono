<template>
  <demo-block title="根据脱敏状态定制 rules">
    <van-form ref="FormRef" :validate-trigger="['onBlur', 'onChange']">
      <section class="demo-section">
        <span class="demo-section-desc">设置初始值: 加密且脱敏</span>
        <van-field label="明文" placeholder="请输入" v-model="dataSourcePlainTxt" />
        <van-field disabled label="密文" v-model="dataSourceCipherTxt" placeholder="输入明文, 制造密文" />
        <p>modelValue:</p>
        {{ filedValue }}
        <FieldMaskTxt
          :hide-eye-icon="hiddenEyeIcon"
          :preset="commonPreset"
          mask-id="maskId"
          v-model="filedValue"
          :field-props="{
            name: 'testField',
            label: '测试字段',
            required: true,
            rules: [{ required: true }],
          }"
          :gen-field-rules="genFieldRules"
          :real-field-props="{
            rules: [],
          }"
        />
        <van-button size="small" @click="() => setHiddenEyeIcon(!hiddenEyeIcon)">
          hiddenEyeIcon:{{ hiddenEyeIcon }}
        </van-button>
      </section>

      <van-button round block type="primary" @click="handleSubmit"> 提交 </van-button>
    </van-form>
  </demo-block>
</template>

<script setup lang="ts">
import { FieldMaskTxt, TMaskTxtProps } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Form as VanForm, Field as VanField, Button as VanButton, FormInstance } from 'vant';
import { getAesCryptoTool, IdRule } from '@vmono/utils';
import { computed, ref, watch } from 'vue';

const [hiddenEyeIcon, setHiddenEyeIcon] = useWrapperRef(false);

const { AES_Encrypt, AES_Dencrypt } = getAesCryptoTool({
  key: '12345678',
});

/**
 * 制造数据源
 */
const [dataSourcePlainTxt] = useWrapperRef('130999199909099999');
const dataSourceCipherTxt = computed(() => commonPreset.encrypt?.(dataSourcePlainTxt.value) as string);
const commonPreset: TMaskTxtProps['preset'] = {
  decrypt: AES_Dencrypt,
  encrypt: AES_Encrypt,
  maskType: 'id',
  fetchPlaintext: async (_maskId) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('模拟接口调用');
        resolve(dataSourceCipherTxt.value!);
      }, 1000);
    });
  },
};

/**
 * 表单逻辑
 */
const [filedValue, setFiledValue] = useWrapperRef(dataSourceCipherTxt.value);
watch(dataSourceCipherTxt, setFiledValue);

const genFieldRules = ({ isPlaintextVisible }) => {
  return [
    {
      required: true,
      message: isPlaintextVisible && IdRule?.message,
      validator:
        isPlaintextVisible &&
        ((value) => {
          return IdRule.pattern.test(value);
        }),
    },
  ];
};

const FormRef = ref<FormInstance>();
const handleSubmit = () => {
  FormRef.value?.validate().then(() => {
    // eslint-disable-next-line no-console
    console.log('getValues', FormRef.value?.getValues?.());
  });
};
</script>

<style scoped lang="less">
//
</style>
