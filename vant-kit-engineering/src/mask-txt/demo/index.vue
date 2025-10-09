<template>
  <BasicUsage />
  <Placeholder />
  <MaskType />
  <MaskStrategy />
  <IconSize />
  <Slot />
</template>

<script setup lang="ts">
import BasicUsage from './BasicUsage.vue';
import Placeholder from './Placeholder.vue';
import MaskType from './MaskType.vue';
import MaskStrategy from './MaskStrategy.vue';
import IconSize from './IconSize.vue';
import Slot from './Slot.vue';
</script>

<style scoped lang="less">
@import 'style/demo-common.less';
</style>
