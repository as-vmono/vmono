<template>
  <button class="demo-button">
    <slot />
  </button>
</template>

<script lang="ts">
export default {
  name: 'DemoButton',
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

const Props = withDefaults(defineProps<{ bgColor?: string }>(), {
  bgColor: '#f44',
});
const computedBgColor = computed(() => Props.bgColor);
</script>

<style scoped lang="less">
.demo-button {
  min-width: 120px;
  color: #fff;
  font-size: 16px;
  line-height: 36px;
  background-color: v-bind(computedBgColor);
  border: none;
  border-radius: 30px;
}
</style>
