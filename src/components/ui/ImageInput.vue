<script lang="ts" setup>
import { defineEmits, ref } from 'vue';

const emit = defineEmits<{
  (event: 'input', file: File | null): void;
}>();

const isDroping = ref(false);

const onDragLeave = (e: DragEvent) => {
  e.preventDefault();
  isDroping.value = false;
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDroping.value = true;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer?.files[0]) {
    isDroping.value = false;
    emit('input', e.dataTransfer.files[0]);
  }
};

const onChange = (e: Event) => {
  const event = e as Event & { target: HTMLInputElement };
  if (event.target?.files) {
    emit('input', event.target.files[0]);
  } else {
    emit('input', null);
  }
};

const accept = 'image/*';
</script>

<template>
  <label
    :class="[`ImageInput`, { isDroping: isDroping }]"
    :ondrop="handleDrop"
    :ondragover="onDragOver"
    :ondragleave="onDragLeave"
  >
    <input type="file" @input="onChange" :accept="accept" class="Input" />
    <p>Drag and drop an image or click to select one</p>
  </label>
</template>

<style scoped>
.ImageInput {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: var(--color-text);
  font-size: 1rem;
  text-align: center;
  background-color: var(--color-background);
  border: none;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.ImageInput > p {
  padding: 1rem 0.5rem;
  transition: color 0.15s ease;
}

.isDroping::before {
  background-color: rgb(128 128 128 / 10%);
}

.isDroping > p {
  color: var(--color-accent);
  opacity: 1;
}

.ImageInput::before {
  position: absolute;
  z-index: 2;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  content: '';
  inset: 0;
}

.ImageInput::after {
  position: absolute;
  z-index: 3;
  display: inline-block;
  box-sizing: border-box;
  background-color: transparent;
  border: 2px dashed transparent;
  border-radius: 12px;
  transition: border-color 0.15s ease;
  content: '';
  inset: 1rem;
}

.ImageInput:hover::after {
  border-color: var(--color-accent);
}

.isDroping::after {
  border-color: var(--color-accent);
}

.Input {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>
