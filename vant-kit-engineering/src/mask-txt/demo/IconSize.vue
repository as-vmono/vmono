<template>
  <demo-block title="自定义图标大小">
    <section>
      <mask-txt icon-size="30" :preset="commonPreset" mask-id="maskId" :mask-txt="dataSourceCipherTxt" />
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import { MaskTxt, TMaskTxtProps } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { getAesCryptoTool } from '@vmono/utils';
import { computed } from 'vue';

const { AES_Encrypt, AES_Dencrypt } = getAesCryptoTool({
  key: '12345678',
});

/**
 * 制造数据源
 */
const [dataSourcePlainTxt] = useWrapperRef('123**678');
const dataSourceCipherTxt = computed(() => commonPreset.encrypt?.(dataSourcePlainTxt.value) as string);

const commonPreset: TMaskTxtProps['preset'] = {
  decrypt: AES_Dencrypt,
  encrypt: AES_Encrypt,
  fetchPlaintext: async (_maskId) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log('模拟接口调用');
        resolve('uZFCVFwW1X+1O2wkVpJNnw==');
      }, 1000);
    });
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
