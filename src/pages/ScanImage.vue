<script lang="ts" setup>
import { ref } from 'vue';

import Container from '@/components/ui/Container.vue';
import Navbar from '@/components/ui/Navbar.vue';
import Page from '@/components/ui/Page.vue';
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

    <Container class="overlay-container" v-if="result || error">
      <div class="overlay">
        <p v-if="result">Last result: {{ result }}</p>
        <p>{{ error }}</p>
      </div>
    </Container>

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
}

.overlay-container {
  width: 100%;
  margin-top: auto;
  margin-bottom: 0;
  max-width: 500px;
}

.overlay {
  width: 100%;
  background-color: var(--color-paper);
  opacity: 1;
  border-radius: 6px;
  line-height: 1.5;
  font-size: 2rem;
  text-align: center;
  color: var(--color-text);
}
</style>
