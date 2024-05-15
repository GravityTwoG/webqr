<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  class?: string;
  id?: string;
  href?: string;
  download?: string;
}>();

const emit = defineEmits<{
  (event: 'click', e: Event): void;
}>();

const onClick = (event: Event) => {
  emit('click', event);
};
</script>

<template>
  <a
    :class="[`button`, props.class]"
    :id="props.id"
    :href="props.href"
    :download="props.download"
    @click="onClick"
  >
    <span class="button-text"><slot /></span>
    <span></span>
  </a>
</template>

<style scoped>
.button {
  padding: 1rem 3rem;
  font-size: 1.25rem;
  line-height: 1;
  position: relative;
  cursor: pointer;
  background-color: #111;
  color: #eee;
  text-decoration: none;
  border-radius: 0.5rem;
  outline: none;
  border: none;
  background: radial-gradient(
      circle at 50% 0%,
      rgba(250, 250, 250, 0.05) 0%,
      transparent 60%
    ),
    rgba(15, 15, 15, 1);
  scale: 1;
  transition: scale 0.1s ease;
  --x: 100%;

  & .button-text {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    mask-image: linear-gradient(
      -75deg,
      white calc(var(--x) + 20%),
      transparent calc(var(--x) + 30%),
      white calc(var(--x) + 100%)
    );
  }

  & span:not(.button-text) {
    display: block;
    position: absolute;
    inset: 0;
    padding: 2px;
    border-radius: 0.5rem;
    overflow: hidden;
    background-image: linear-gradient(
      -75deg,
      rgba(255, 255, 255, 0.1) calc(var(--x) + 20%),
      rgba(255, 255, 255, 0.5) calc(var(--x) + 25%),
      rgba(255, 255, 255, 0.1) calc(var(--x) + 100%)
    );
    mask: linear-gradient(black, black) content-box,
      linear-gradient(black, black);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
  }

  &:active {
    scale: 0.97;
  }
}
</style>
