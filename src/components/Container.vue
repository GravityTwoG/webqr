<script lang="ts" setup></script>

<template>
  <div class="container"><slot /></div>
</template>

<style scoped>
.container {
  margin: auto;
  max-width: 800px;
}
@media (max-width: 824px) {
  .container {
    margin: auto 12px;
  }
}
</style>
