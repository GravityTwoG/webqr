<script lang="ts" setup>
import { ref } from 'vue';

import AppContainer from '@/components/Container.vue';
import Navbar from '@/components/Navbar.vue';
import Page from '@/components/Page.vue';
import ImageQRCodeReader from '@/components/ImageQRCodeReader.vue';

const result = ref('');
const error = ref('');

const onDecode = (newResult: string) => {
  result.value = newResult;
  error.value = '';
};

const onError = (err: string) => {
  error.value = err;
};
</script>

<template>
  <Page class="page">
    <div class="preview-box">
      <ImageQRCodeReader @decode="onDecode" @error="onError" />
    </div>

    <AppContainer class="overlay" v-if="result || error">
      <p v-if="result">Last result: {{ result }}</p>
      <p>{{ error }}</p>
    </AppContainer>

    <Navbar />
  </Page>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-box {
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: -1;
}

.overlay {
  width: 100%;
  background-color: var(--color-paper);
  opacity: 1;
  max-width: 500px;
  margin-top: auto;
  margin-bottom: 0;
  border-radius: 6px;
  line-height: 1.5;
  font-size: 2rem;
  text-align: center;
  color: var(--color-text);
}
</style>
