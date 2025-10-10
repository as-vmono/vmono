<template>
  <BasicUsage />
  <Slot />
</template>

<script setup lang="ts">
import BasicUsage from './BasicUsage.vue';
import Slot from './Slot.vue';
</script>

<style scoped lang="less">
@import 'style/demo-common.less';
</style>
