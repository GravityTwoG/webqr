<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{ class?: string }>();
</script>

<template>
  <div :class="[`page`, props.class]"><slot /></div>
</template>

<style scoped>
.page {
  height: 100vh;
  height: 100dvh;
  padding-bottom: 5rem;
  overflow: auto;
}
</style>
