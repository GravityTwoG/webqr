<script lang="ts" setup>
import { ref } from 'vue';

import Navbar from '@/components/ui/Navbar.vue';
import Page from '@/components/ui/Page.vue';
import ImageQRCodeReader from '@/components/ImageQRCodeReader.vue';
import ScanResult from '@/components/ScanResult.vue';
import ScanError from '@/components/ScanError.vue';
import { vibrate } from '@/vibrate';

const result = ref('');
const error = ref('');

const onDecode = (newResult: string) => {
  if (newResult !== result.value) {
    vibrate(500);
  }
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

    <ScanResult :result="result" />
    <ScanError :error="error" />

    <Navbar />
  </Page>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.preview-box {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  top: 0;
  position: fixed;
}
</style>
