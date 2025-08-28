<template>
  <div :class="CommonWrapperClass">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { CommonWrapperClass } from '@/common/constants';
</script>

<style scoped lang="less"></style>
