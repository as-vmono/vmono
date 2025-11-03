<template>
  <demo-block title="基础用法">
    <BasicUsage />
  </demo-block>
  <demo-block title="开启搜索功能">
    <SearchModeUsage />
  </demo-block>
  <demo-block title="处理 id 未匹配到选项时展示的值">
    <ProcessingFallbackOpts />
  </demo-block>
</template>

<script setup lang="ts">
import BasicUsage from './BasicUsage.vue';
import SearchModeUsage from './SearchModeUsage.vue';
import ProcessingFallbackOpts from './ProcessingFallbackOpts.vue';
</script>

<style scoped lang="less">
@import 'style/demo-common.less';
</style>
