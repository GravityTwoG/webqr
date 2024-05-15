<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  error: string;
}>();
</script>

<template>
  <div class="error-container">
    <p v-if="props.error" class="error">{{ props.error }}</p>
  </div>
</template>

<style scoped>
.error-container {
  height: 1.5rem;
  z-index: 0;
}

.error {
  color: red;
  font-size: 1rem;
  line-height: 1;

  background-color: var(--color-paper);
  padding: 0.25rem;
  margin-top: 0.25rem;
  border-radius: 6px;
  text-align: center;
}
</style>
