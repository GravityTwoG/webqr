<script lang="ts" setup>
import { defineProps } from 'vue';

export type Props = {
  class?: string;
};

const props = defineProps<Props>();
</script>

<template>
  <div :class="[`container`, props.class]"><slot /></div>
</template>

<style scoped>
.container {
  margin: auto;
  max-width: 800px;
  padding: 0 12px;
}
</style>
