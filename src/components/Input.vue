<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  class?: string;
  type?: string;
  value?: string;
  placeholder?: string;
}>();

type InputEvent = Omit<Event, 'target'> & { target: HTMLInputElement };

const emit = defineEmits<{
  (event: 'input', e: InputEvent): void;
}>();
</script>

<template>
  <input
    :type="props.type"
    :class="[`Input`, props.class]"
    :value="props.value"
    :placeholder="props.placeholder"
    @input="emit('input', $event as InputEvent)"
  />
</template>

<style scoped>
.Input {
  width: 100%;
  padding: 0.5rem;
  color: var(--color-text);
  font-size: 1.5rem;
  background-color: var(--color-paper);
  border: 2px solid var(--color-deco);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.1s ease;
  caret-color: var(--color-accent);
}

.Input:focus {
  border-color: var(--color-accent);
}
</style>
