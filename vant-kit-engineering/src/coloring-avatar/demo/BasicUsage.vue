<template>
  <demo-block title="中文名">
    <section>
      <span class="desc">展示后两个字符 (李钟硕)</span>
      <ColoringAvatar name="李钟硕" />
    </section>
  </demo-block>
  <demo-block title="英文名">
    <section>
      <span class="desc">展示第一个字符 (IU)</span>
      <ColoringAvatar name="IU" />
    </section>
  </demo-block>
  <demo-block title="自定义颜色">
    <section>
      <ColoringAvatar name="Ashun" :bg-attr="bgAttr" />
      <van-space>
        <van-button
          size="small"
          type="primary"
          v-for="item in changeBgAttrList"
          :key="item.value"
          :color="item.value"
          @click="setBgAttr(item.value)"
        >
          {{ item.desc }}
        </van-button>
      </van-space>
    </section>
  </demo-block>
  <demo-block title="自定义文字大小(24px)">
    <section>
      <ColoringAvatar name="Ashun" :font-size="24" />
    </section>
  </demo-block>
  <demo-block title="自定义头像尺寸(20px)">
    <section>
      <ColoringAvatar name="Ashun" :size="20" />
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import { ColoringAvatar } from '@vmono/vant-kit';
import { useWrapperRef } from '@vmono/vhooks';
import { Space as VanSpace, Button as VanButton } from 'vant';

const changeBgAttrList = [
  {
    desc: '黑色',
    value: 'black',
  },
  {
    desc: '紫色',
    value: '#8e44ad',
  },
  {
    desc: '粉色',
    value: 'pink',
  },
  {
    desc: '土豪金',
    value: 'linear-gradient(90deg, #b35b1d, #d97b2e, #d97b2e, #ffb86b, #d97b2e, #d97b2e, #b35b1d)',
  },
];
const [bgAttr, setBgAttr] = useWrapperRef(changeBgAttrList[3].value);
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
