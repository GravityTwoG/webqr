<script lang="ts" setup>
import { onMounted, onBeforeUnmount, defineEmits, defineProps } from 'vue';
import {
  createWorker,
  destroyWorker,
  registerMessageListener,
  sendDecodeMessage,
} from '@/core/qr-recognition.worker-api';
import ImageInput from './ImageInput.vue';

export type Props = {
  class?: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: 'decode', data: string): void;
  (event: 'error', value: string): void;
}>();

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let src: string | null = null;

onMounted(() => {
  canvas = document.querySelector('.canvas');
  if (!canvas) return;
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

const onChangeInput = (file: File | null) => {
  if (!file) return;

  if (src) {
    URL.revokeObjectURL(src);
    src = null;
  }

  //FIX: qr detecting on images with transparent background
  const image = new Image();

  image.onload = () => {
    if (!canvas) return;
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;
    sendDecodeMessage(imageData);
  };

  image.src = URL.createObjectURL(file);
  src = image.src;
};
</script>

<template>
  <div :class="[`qr-image-dropzone`, props.class]">
    <canvas class="canvas" />
    <ImageInput @input="onChangeInput" />
  </div>
</template>

<style scoped>
.qr-image-dropzone {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.qr-image-dropzone canvas {
  max-width: 100%;
  max-height: calc(100% - 10rem);
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
}
</style>
