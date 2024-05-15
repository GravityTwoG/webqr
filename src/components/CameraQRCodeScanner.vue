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
import Select from './Select.vue';

export type Props = {
  class?: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: 'decode', data: string): void;
  (event: 'error', value: string): void;
}>();

const isMounted = ref(false);
const isMediaStreamAPISupported = ref(_isMediaStreamAPISupported());
const isCameraAllowed = ref(true);
const cameraStreamError = ref('');
const devices = ref<{ value: string; label: string }[]>([]);
const selectedDevice = ref('');

let throttledSendMessage: (message: ImageData) => void = () => {
  console.log('no camera');
};

let stopCamera: () => void = () => {
  console.log('stop camera');
};

onMounted(() => {
  if (!isMediaStreamAPISupported.value) {
    return;
  }

  enumerateDevices()
    .then((newDevices) => {
      const _devices: { value: string; label: string }[] = [];
      newDevices.forEach((device, idx) => {
        if (device.kind === 'videoinput') {
          _devices.push({
            value: device.deviceId,
            label: device.label || `video input ${idx}`,
          });
        }
      });
      devices.value = _devices;
    })
    .catch(console.log);

  if (devices.value.length) {
    selectedDevice.value = devices.value[0].value;
  }

  isMounted.value = true;
  if (!isMediaStreamAPISupported.value) {
    return;
  }

  createWorker();
  throttledSendMessage = throttle(sendDecodeMessage, 200);
  registerMessageListener((code) => {
    if (code) {
      emit('decode', code.data);
    } else {
      emit('error', 'not found');
    }
  });

  startVideoStream(selectedDevice.value);
});

onBeforeUnmount(() => {
  isMounted.value = false;
  if (stopCamera) stopCamera();
  destroyWorker();
});

watch(selectedDevice, () => {
  startVideoStream(selectedDevice.value);
});

const startVideoStream = async (currentDevice: string) => {
  if (stopCamera) stopCamera();

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  const video = document.createElement('video');

  const tick = () => {
    if (!isMounted.value) return;
    if (currentDevice !== selectedDevice.value) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      throttledSendMessage(imageData);
    }
    requestAnimationFrame(tick);
  };

  try {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const stream = await getCameraStream({
      deviceId: currentDevice,
      idealWidth: 720,
      idealHeight: 720 / aspectRatio,
    });

    const streamTrack = stream.getTracks()[0];

    stopCamera = streamTrack.stop.bind(streamTrack);
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
</script>

<template>
  <div :class="[`scanner-container`, props.class]">
    <canvas v-if="isMediaStreamAPISupported" id="canvas" />
    <p v-else>Media stream API is not supported.</p>
    <p v-if="!isCameraAllowed">
      No access to camera.<br />{{ cameraStreamError }}
    </p>

    <div v-if="devices.length > 1" class="scanner-control">
      <Select
        :value="selectedDevice"
        @input="selectedDevice = $event.target.value"
        :options="devices"
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
  width: 100%;
  max-width: 100%;
  max-height: 100%;
}

.scanner-control {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%);
}

video {
  max-width: 100%;
  max-height: 100%;
}
</style>
