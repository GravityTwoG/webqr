<script lang="ts" setup>
import { defineProps } from 'vue';
import Container from '@/components/ui/Container.vue';

const props = defineProps<{
  result: string;
}>();
</script>

<template>
  <Container class="overlay-container" v-if="props.result">
    <div class="overlay">
      <p v-if="props.result">
        Last result:
        <a
          v-if="props.result.includes('.')"
          :href="props.result"
          target="_blank"
        >
          {{ props.result }}
        </a>
        <span v-else>{{ props.result }}</span>
      </p>
    </div>
  </Container>
</template>

<style scoped>
.overlay-container {
  width: 100%;
  margin-top: auto;
  margin-bottom: 0;
  max-width: 500px;
  z-index: 1;
}

.overlay {
  width: 100%;
  background-color: var(--color-paper);
  opacity: 1;
  border-radius: 6px;
  line-height: 1.5;
  font-size: 1.25rem;
  text-align: center;
  color: var(--color-text);
  padding: 0.5rem;
}

.overlay p {
  word-wrap: break-word;
}

.overlay a {
  color: var(--color-text);
}
</style>
