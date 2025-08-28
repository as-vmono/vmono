<template>
  <demo-block title="基础用法">
    <BasicUsage />
  </demo-block>
  <demo-block title="开启搜索功能">
    <SearchModeUsage />
  </demo-block>
  <demo-block title="禁用选项逻辑增强">
    <DisableOptionUsage />
  </demo-block>
</template>

<script setup lang="ts">
import BasicUsage from './BasicUsage.vue';
import SearchModeUsage from './SearchModeUsage.vue';
import DisableOptionUsage from './DisableOptionUsage.vue';
</script>

<style scoped lang="less">
@import 'style/demo-common.less';
</style>
