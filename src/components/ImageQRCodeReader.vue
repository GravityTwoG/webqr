<template>
  <div class="qr-image-dropzone">
    <va-file-upload
      @input="onChangeInput"
      dropzone
      file-types=".jpg,.png"
      type="gallery"
    />
    <canvas class="canvas" />
  </div>
</template>

<style scoped>
.qr-image-dropzone {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}
.qr-image-dropzone .va-file-upload {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: static;
}
.qr-image-dropzone .va-file-upload .va-file-upload__field {
  position: static !important;
}
.qr-image-dropzone canvas {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  max-width: 100%;
  z-index: 1;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
  createWorker,
  destroyWorker,
  registerMessageListener,
  sendDecodeMessage,
} from '@/qr-recognition.worker-api';

@Options({
  name: 'image-qrcode-reader',
  emits: ['decode', 'error'],

  data() {
    return {};
  },
  mounted() {
    const canvas = this.$el.querySelector('.canvas');
    canvas.width = 0;
    canvas.height = 0;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.src = null;

    createWorker();
    registerMessageListener((code) => {
      if (code) {
        this.$emit('decode', code.data);
      } else {
        this.$emit('error', 'not found');
      }
    });
  },
  beforeUnmount() {
    if (this.src) {
      URL.revokeObjectURL(this.src);
    }
    destroyWorker();
  },
  methods: {
    onChangeInput(e: Event) {
      const target = e.target as HTMLInputElement;
      if (!target) return;
      const files = target.files as FileList;
      if (!files.length) return;

      if (this.src) {
        URL.revokeObjectURL(this.src);
        this.src = null;
      }

      //FIX: qr detecting on images with transparent background
      const image = new Image();

      image.onload = () => {
        this.canvas.width = image.width;
        this.canvas.height = image.height;

        this.ctx.drawImage(image, 0, 0, image.width, image.height);

        const imageData = this.ctx.getImageData(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        if (!imageData) return;
        sendDecodeMessage(imageData);
      };

      image.src = URL.createObjectURL(files[0]);
      this.src = image.src;
    },
  },
})
export default class QRCodeReader extends Vue {}
</script>
