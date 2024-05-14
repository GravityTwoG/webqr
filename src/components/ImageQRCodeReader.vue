<script lang="ts" setup>
import { onMounted, onBeforeUnmount, defineEmits } from 'vue';
import {
  createWorker,
  destroyWorker,
  registerMessageListener,
  sendDecodeMessage,
} from '@/qr-recognition.worker-api';

const emit = defineEmits<{
  decode: [data: string];
  error: [value: string];
}>();

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let src: string | null = null;

onMounted(() => {
  canvas = document.querySelector('.canvas');
  canvas.width = 0;
  canvas.height = 0;
  ctx = canvas.getContext('2d');
  src = null;

  createWorker();
  registerMessageListener((code) => {
    if (code) {
      emit('decode', code.data);
    } else {
      emit('error', 'not found');
    }
  });
});

onBeforeUnmount(() => {
  if (src) {
    URL.revokeObjectURL(src);
  }
  destroyWorker();
});

const onChangeInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target) return;
  const files = target.files as FileList;
  if (!files.length) return;

  if (src) {
    URL.revokeObjectURL(src);
    src = null;
  }

  //FIX: qr detecting on images with transparent background
  const image = new Image();

  image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;
    sendDecodeMessage(imageData);
  };

  image.src = URL.createObjectURL(files[0]);
  src = image.src;
};
</script>

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

<style>
.qr-image-dropzone .va-file-upload {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: static;
}
.va-file-upload .va-file-upload__field {
  position: static !important;
  gap: 0.5rem;
}
</style>
