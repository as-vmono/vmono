<template>
  <demo-block title="基础用法">
    <section>
      <span class="desc">自定义 trigger</span>
      <van-field label="文本框" placeholder="请输入" v-model="txt">
        <template #right-icon>
          <CopyTxtTrigger :txt="txt">
            <template #default="{ copy }">
              <van-button size="mini" type="primary" @click="copy(txt!)"> 复制内容 </van-button>
            </template>
          </CopyTxtTrigger>
        </template>
      </van-field>
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import { CopyTxtTrigger } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Field as VanField, Button as VanButton } from 'vant';

const [txt] = useWrapperRef('');
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
