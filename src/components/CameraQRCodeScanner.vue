<script lang="ts" setup>
import {
  onMounted,
  onBeforeUnmount,
  defineEmits,
  defineProps,
  watch,
  ref,
} from 'vue';
import { throttle } from '@/utilities';

import {
  createWorker,
  destroyWorker,
  registerMessageListener,
  sendDecodeMessage,
} from '@/core/qr-recognition.worker-api';
import {
  isMediaStreamAPISupported as _isMediaStreamAPISupported,
  getCameraStream,
  enumerateDevices,
} from '@/core/mediaStreamAPI';
import Select from './ui/Select.vue';

export type Props = {
  class?: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: 'decode', data: string): void;
  (event: 'error', value: string): void;
}>();

type Device = {
  value: string;
  label: string;
};

const isMounted = ref(false);
const isMediaStreamAPISupported = ref(_isMediaStreamAPISupported());
const isCameraAllowed = ref(true);
const cameraStreamError = ref('');
const cameras = ref<Device[]>([]);
const selectedCamera = ref({ value: '', label: '' });
const isFrontCamera = ref(false);

const throttledSendMessage = ref<(message: ImageData) => void>(() => {
  console.log('no camera');
});

const startVideoStream = async (currentCamera: Device) => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  const video = document.createElement('video');

  const tick = () => {
    if (!isMounted.value) return;
    if (currentCamera !== selectedCamera.value) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      throttledSendMessage.value(imageData);
    }
    requestAnimationFrame(tick);
  };

  try {
    const width = 1080;
    const aspectRatio = window.innerWidth / window.innerHeight;
    const stream = await getCameraStream({
      deviceId: currentCamera.value,
      idealWidth: width,
      idealHeight: Math.round(width / aspectRatio),
      aspectRatio: 1 / aspectRatio,
    });

    const streamTrack = stream.getTracks()[0];

    stopCamera.value = streamTrack.stop.bind(streamTrack);
    isCameraAllowed.value = true;

    video.srcObject = stream;
    video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
  } catch (e) {
    console.log('Error on getCameraStream: ', e);
    isCameraAllowed.value = false;
    cameraStreamError.value = e as string;
  }
};

const stopCamera = ref(() => {
  console.log('stop camera');
});

onMounted(async () => {
  isMounted.value = true;

  if (!isMediaStreamAPISupported.value) {
    return;
  }
  try {
    createWorker();
    throttledSendMessage.value = throttle(sendDecodeMessage, 200);
    registerMessageListener((code) => {
      if (code) {
        emit('decode', code.data);
      } else {
        emit('error', 'not found');
      }
    });

    const newDevices = await enumerateDevices();
    const _cameras: { value: string; label: string }[] = [];
    newDevices.forEach((device, idx) => {
      if (device.kind === 'videoinput') {
        _cameras.push({
          value: device.deviceId,
          label: device.label || `video input ${idx}`,
        });
      }
    });
    cameras.value = _cameras;

    if (cameras.value.length) {
      const rearCamera = cameras.value.find((d) =>
        d.label.toLowerCase().includes('back')
      );

      if (rearCamera) {
        selectedCamera.value = rearCamera;
      } else {
        selectedCamera.value = cameras.value[0];
      }
    }
  } catch (e) {
    console.error(e);
  }
});

onBeforeUnmount(() => {
  isMounted.value = false;
  stopCamera.value();
  destroyWorker();
});

const onCameraSelect = (deviceId: string) => {
  const camera = cameras.value.find((c) => c.value === deviceId);
  if (!camera) return;

  selectedCamera.value = camera;
};

watch(selectedCamera, () => {
  stopCamera.value();
  startVideoStream(selectedCamera.value);

  const cameraLabel = selectedCamera.value.label.toLowerCase();
  isFrontCamera.value =
    cameraLabel.includes('front') || cameraLabel.includes('facetime');
});
</script>

<template>
  <div :class="[`scanner-container`, props.class]">
    <canvas
      v-if="isMediaStreamAPISupported"
      id="canvas"
      :style="{ transform: isFrontCamera ? `scaleX(-1)` : `scaleX(1)` }"
    />
    <p v-else>Media stream API is not supported.</p>
    <p v-if="!isCameraAllowed">
      No access to camera.<br />{{ cameraStreamError }}
    </p>

    <div v-if="cameras.length > 1" class="scanner-control">
      <Select
        :value="selectedCamera.value"
        @input="onCameraSelect($event.target.value)"
        :options="cameras"
        placeholder="Select videoInput device"
      />
    </div>
  </div>
</template>

<style scoped>
.scanner-container {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.scanner-container canvas {
  width: 100vw;
  max-width: 100vw;
  max-height: 100%;
  max-height: 100dvh;
}

.scanner-control {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translate(-50%);
}

video {
  max-width: 100%;
  max-height: 100%;
}
</style>
