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
  padding-bottom: 6rem;
  overflow: auto;
}
</style>
