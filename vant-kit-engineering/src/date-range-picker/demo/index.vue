<template>
  <demo-block title="基础用法">
    <BasicUsage />
  </demo-block>
  <demo-block title="格式化展示值">
    <ShowValueFormatter />
  </demo-block>
  <demo-block title="自定义 picker 打开时默认选中的值">
    <SetPickerRealtimeDate />
  </demo-block>
  <demo-block title="确认前的自定义拦截处理逻辑">
    <BeforeConfirm />
  </demo-block>
  <demo-block title="支持所有 date-picker props">
    <demo-block title="例如设置 columnsType 为: 月日" :style="{ padding: '0px 20px' }">
      <ColumnsType />
    </demo-block>
  </demo-block>
  <demo-block title="支持所有 picker-group props">
    <demo-block title="例如设置 confirmButtonText" :style="{ padding: '0px 20px' }">
      <ConfirmButtonText />
    </demo-block>
  </demo-block>
  <demo-block title="支持所有 picker-group slots">
    <demo-block title="例如设置 toolbar" :style="{ padding: '0px 20px' }">
      <Toolbar />
    </demo-block>
  </demo-block>
</template>

<script setup lang="ts">
import BasicUsage from './BasicUsage.vue';
import ShowValueFormatter from './ShowValueFormatter.vue';
import SetPickerRealtimeDate from './SetPickerRealtimeDate.vue';
import BeforeConfirm from './BeforeConfirm.vue';
import ColumnsType from './SupportAllPickerProps/ColumnsType.vue';
import ConfirmButtonText from './SupportAllPickerGroupProps/ConfirmButtonText.vue';
import Toolbar from './SupportAllPickerGroupSlots/Toolbar.vue';
</script>

<style scoped lang="less">
@import 'style/demo-common.less';
</style>
