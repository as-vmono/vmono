<template>
  <demo-block title="自带一些内置脱敏策略">
    <section>
      <SinglePicker
        v-model="maskType"
        :picker-props="{
          title: '基础用法',
          columns: columns,
        }"
        @confirm="onConfirm"
      >
        <template #trigger="{ triggerPopupShow, showValue }">
          <van-button type="primary" @click="triggerPopupShow">
            当前脱敏策略: {{ showValue }} - {{ maskType }}
          </van-button>
        </template>
      </SinglePicker>
      <span class="desc">设置初始值: 加密且脱敏</span>
      <van-field label="明文" placeholder="请输入" v-model="dataSourcePlainTxt" />
      <van-field disabled label="密文" v-model="dataSourceCipherTxt" placeholder="输入明文, 制造密文" />
      <mask-txt v-if="render" :preset="commonPreset" mask-id="maskId" :mask-txt="dataSourceCipherTxt" />
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import { MaskTxt, TMaskTxtProps, SinglePicker } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Field as VanField, Button as VanButton } from 'vant';
import { getAesCryptoTool } from '@vmono/utils';
import { computed, ComputedRef } from 'vue';

const [render, setRender] = useWrapperRef(true);

const [maskType] = useWrapperRef<TMaskTxtProps['preset']['maskType']>('id');
const columns: Array<{
  label: string;
  value: TMaskTxtProps['preset']['maskType'];
}> = [
  { label: '身份证', value: 'id' },
  { label: '手机号', value: 'phone' },
  { label: '邮箱', value: 'email' },
  { label: '银行卡号', value: 'bankCard' },
];

const onConfirm = () => {
  setRender(false);
  setTimeout(() => {
    setRender(true);
  }, 300);
};

const { AES_Encrypt, AES_Dencrypt } = getAesCryptoTool({
  key: '12345678',
});

/**
 * 制造数据源
 */
const [dataSourcePlainTxt] = useWrapperRef('');
const dataSourceCipherTxt = computed(() => commonPreset.value?.encrypt?.(dataSourcePlainTxt.value) as string);

const commonPreset: ComputedRef<TMaskTxtProps['preset']> = computed(() => ({
  decrypt: AES_Dencrypt,
  encrypt: AES_Encrypt,
  fetchPlaintext: async (_maskId) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('模拟接口调用');
        resolve(dataSourceCipherTxt.value!);
      }, 1000);
    });
  },
  maskType: maskType.value,
}));
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
