<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  class?: string;
  value?: string;
  options: readonly { value: string; label: string }[];
}>();

type InputEvent = Omit<Event, 'target'> & { target: HTMLSelectElement };

const emit = defineEmits<{
  (event: 'input', e: InputEvent): void;
}>();
</script>

<template>
  <select
    :class="[`Select`, props.class]"
    :value="props.value"
    @input="emit('input', $event as InputEvent)"
  >
    <option
      v-for="option in props.options"
      :value="option.value"
      :key="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
.Select {
  width: 100%;
  padding: calc(0.75rem - 1px);
  color: var(--color-text);
  font-size: 1.25rem;
  font-family: inherit;
  line-height: 1;
  background-color: var(--color-paper);
  border: 2px solid var(--color-deco);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.1s ease;
}

.Select:focus {
  border-color: var(--color-accent);
}

.Select:disabled {
  font-weight: 700;
  background-color: #fff;
}
</style>
