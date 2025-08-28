<template>
  <VantKitCpnWrapper>
    <div class="coloring-avatar-wrapper">
      <span class="sub-name" v-if="name">{{ getAvatarName(name) }}</span>
    </div>
  </VantKitCpnWrapper>
</template>

<script lang="ts">
const avatarBgValues = [
  'linear-gradient(180deg, #2590FF 0%, #165DFF 100%)',
  'linear-gradient(180deg, #F52A2A 0%, #EB2F96 100%)',
  'linear-gradient(180deg, #1FC478 0%, #52C41A 100%)',
  'linear-gradient(180deg, rgba(250, 84, 28, 0.8784) 0%, #FAAD14 100%)',
  'linear-gradient(to bottom, #acb6e5, #74ebd5)',
];

function genRandomAvatarBgAttr() {
  const randomIndex = Math.floor(Math.random() * avatarBgValues.length);
  return avatarBgValues[randomIndex];
}
</script>
<script lang="ts" setup>
import VantKitCpnWrapper from '@/common/VantKitCpnWrapper.vue';
import { computed } from 'vue';

const Props = withDefaults(defineProps<{ name: string; size?: number; fontSize?: number; bgAttr?: string }>(), {
  size: 36,
  fontSize: 14,
  bgAttr: undefined,
});

const sizeInProps = computed(() => Props.size + 'px');
const fontSizeInProps = computed(() => Props.fontSize + 'px');
const calcBgAttr = computed(() => Props.bgAttr ?? genRandomAvatarBgAttr());

/**
 * 获取头像中展示的名字
 */
const includesChinese = (str) => {
  const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
  if (reg.test(str)) {
    return true;
  }
  return false;
};

const getAvatarNameByChinese = (name: string): string => {
  return name.slice(name.length - 2);
};
const getAvatarNameByEnglish = (name: string): string => {
  return name.slice(0, 1);
};
function getAvatarName(name: string) {
  // const isEnglish = /^[a-z]+$/i.test(name)
  // return isEnglish ? getAvatarNameByEnglish(name) : getAvatarNameByChinese(name)
  return includesChinese(name) ? getAvatarNameByChinese(name) : getAvatarNameByEnglish(name);
}
</script>

<style scoped lang="less">
.coloring-avatar-wrapper {
  box-sizing: border-box;
  width: v-bind(sizeInProps);
  height: v-bind(sizeInProps);
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  background: v-bind(calcBgAttr);

  border-radius: 50%;
  border: 0.88px solid;
  border-image: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);

  .sub-name {
    // transform: scale(0.8);
    color: #fff;
    font-size: v-bind(fontSizeInProps);
  }
}
</style>
