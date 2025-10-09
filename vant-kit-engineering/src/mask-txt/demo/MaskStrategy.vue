<template>
  <demo-block title="自定义脱敏策略">
    <section>
      <span class="desc">设置初始值: 加密且脱敏</span>
      <van-field label="明文" placeholder="请输入" v-model="dataSourcePlainTxt" />
      <van-field disabled label="密文" v-model="dataSourceCipherTxt" placeholder="输入明文, 制造密文" />
      <mask-txt :preset="commonPreset" mask-id="maskId" :mask-txt="dataSourceCipherTxt" />
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import { MaskTxt, TMaskTxtProps } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Field as VanField } from 'vant';
import { getAesCryptoTool } from '@vmono/utils';
import { computed } from 'vue';

const { AES_Encrypt, AES_Dencrypt } = getAesCryptoTool({
  key: '12345678',
});

/**
 * 制造数据源
 */
const [dataSourcePlainTxt] = useWrapperRef('');
const dataSourceCipherTxt = computed(() => commonPreset.encrypt?.(dataSourcePlainTxt.value) as string);

const commonPreset: TMaskTxtProps['preset'] = {
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
  placeholder: '😀',
  maskStrategy(str) {
    try {
      return `👉${str.replace(/./g, '😀')}👈`;
    } catch (_) {
      _;
      return '';
    }
  },
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
