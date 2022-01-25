<template>
  <app-container>
    <div class="flex xl12">
      <va-card>
        <va-card-content>
          <p>Upload your image with QR code</p>
          <va-divider />

          <div class="preview-box">
            <ImageBarcodeReader
              v-if="!isCameraEnabled"
              @decode="onDecode"
              @error="onError"
            />

            <div v-if="isCameraEnabled" class="camera-preview">
              <StreamBarcodeReader @decode="onDecode" @error="onError" />
            </div>
          </div>
        </va-card-content>

        <va-card-content>
          <p>Or you can easily scan QR code with camera</p>

          <va-divider />
          <p>{{ result }}</p>
          <p>{{ error }}</p>
        </va-card-content>

        <va-card-actions align="center" vertical>
          <va-button @click="onSwitch" gradient icon-right="center_focus_weak">
            <span v-if="!isCameraEnabled">Scan</span>
            <span v-if="isCameraEnabled">Upload File</span>
          </va-button>
        </va-card-actions>
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
  overflow: hidden;
}

.scanner-container {
  max-width: 100%;
  max-height: 100%;
  height: 100%;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ImageBarcodeReader from '../components/ImageQRCodeReader.vue';
import StreamBarcodeReader from '../components/CameraQRCodeScanner.vue';

@Options({
  components: { ImageBarcodeReader, StreamBarcodeReader },
  data() {
    return { isCameraEnabled: false, result: '', error: '' };
  },
  methods: {
    onSwitch() {
      this.isCameraEnabled = !this.isCameraEnabled;
      this.result = '';
      this.error = '';
    },
    onDecode(result: unknown) {
      this.result = result;
      this.error = '';
    },
    onError(err: unknown) {
      this.error = err;
    },
  },
})
export default class Home extends Vue {}
</script>
