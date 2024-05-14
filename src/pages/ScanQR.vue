<script lang="ts" setup>
import { ref } from 'vue';

import ImageQRCodeReader from '../components/ImageQRCodeReader.vue';
import CameraQRCodeReader from '../components/CameraQRCodeScanner.vue';

const isCameraEnabled = ref(false);
const result = ref('');
const error = ref('');

const onSwitch = () => {
  isCameraEnabled.value = !isCameraEnabled.value;
  result.value = '';
  error.value = '';
};

const onDecode = (newResult: string) => {
  result.value = newResult;
  error.value = '';
};

const onError = (err: string) => {
  error.value = err;
};
</script>

<template>
  <app-container>
    <div class="flex xl12">
      <va-card>
        <va-card-content>
          <div class="preview-box">
            <ImageQRCodeReader
              v-if="!isCameraEnabled"
              @decode="onDecode"
              @error="onError"
            />

            <div v-if="isCameraEnabled" class="camera-preview">
              <CameraQRCodeReader @decode="onDecode" @error="onError" />
            </div>
          </div>
        </va-card-content>

        <va-card-content>
          <p>{{ result }}</p>
          <p>{{ error }}</p>
        </va-card-content>

        <va-card-content>
          <p class="mb-2">Upload your image with QR code.</p>
          <p v-if="!isCameraEnabled" class="mb-2">
            Or you can easily scan QR code with camera.
          </p>

          <va-button @click="onSwitch" gradient icon-right="center_focus_weak">
            <span v-if="!isCameraEnabled">Scan</span>
            <span v-else>Upload File</span>
          </va-button>
        </va-card-content>
      </va-card>
    </div>
  </app-container>
</template>

<style scoped>
.preview-box {
  height: 300px;
}

.preview-box .qr-image-dropzone {
  height: 100%;
  position: relative;
}

.preview-box .camera-preview {
  height: 100%;
  border-radius: 6px;
  background-color: rgb(46 132 224 / 8%);
}
</style>
