<script lang="ts" setup>
import { defineProps } from 'vue';

export type Props = {
  class?: string;
};

const props = defineProps<Props>();

const currentYear = new Date(Date.now()).getFullYear();
</script>

<template>
  <p :class="props.class">
    WebQR {{ currentYear }}. Developed by
    <a class="author" href="https://github.com/GravityTwoG" target="_blank"
      >GravityTwoG</a
    >
  </p>
</template>

<style scoped>
p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

i {
  vertical-align: bottom;
}

.author {
  display: inline-block;
  vertical-align: baseline;
  background-color: #fff;
  padding: 0.25rem 0.5rem 0.1rem;

  color: black;
  line-height: 1;
  transition: background-color 0.2s ease-out;
  box-shadow: var(--va-card-box-shadow, var(--va-block-box-shadow));
  border-radius: 6px;
  text-decoration: none;
}
.author:hover {
  background-color: #f1f1f1;
}
</style>
