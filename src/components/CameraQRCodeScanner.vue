<script lang="ts" setup>
import { onMounted, onBeforeUnmount, defineEmits, watch, ref } from 'vue';
import { throttle } from '@/utilities';

import {
  createWorker,
  destroyWorker,
  registerMessageListener,
  sendDecodeMessage,
} from '@/qr-recognition.worker-api';
import {
  isMediaStreamAPISupported as _isMediaStreamAPISupported,
  getCameraStream,
  enumerateDevices,
} from '@/mediaStreamAPI';

const emit = defineEmits<{
  decode: [data: string];
  error: [value: string];
}>();

const isMounted = ref(false);
const isMediaStreamAPISupported = ref(_isMediaStreamAPISupported());
const isCameraAllowed = ref(true);
const cameraStreamError = ref('');
const devices = ref<{ value: string; text: string }[]>([]);
const selectedDevice = ref({ value: '', text: '' });

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
    .then((devices) => {
      const _devices: { value: string; text: string }[] = [];
      devices.forEach((device, idx) => {
        if (device.kind === 'videoinput') {
          _devices.push({
            value: device.deviceId,
            text: device.label || `video input ${idx}`,
          });
        }
      });
      devices.value = _devices;
    })
    .catch(console.log);

  if (devices.value.length) {
    selectedDevice.value = {
      value: devices.value[0].deviceid,
      text: devices.value[0].label || `video input ${0}`,
    };
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

  startVideoStream();
});

onBeforeUnmount(() => {
  isMounted.value = false;
  if (stopCamera) stopCamera();
  destroyWorker();
});

watch(selectedDevice, () => {
  startVideoStream();
});

const startVideoStream = () => {
  if (stopCamera) stopCamera();

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const video = document.createElement('video');

  const currentDevice = selectedDevice.value;
  getCameraStream(currentDevice.value)
    .then((stream) => {
      const streamTrack = stream.getTracks()[0];

      stopCamera = streamTrack.stop.bind(streamTrack);
      isCameraAllowed.value = true;

      video.srcObject = stream;
      video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
    })
    .catch((e) => {
      console.log('Error on getCameraStream: ', e);
      isCameraAllowed.value = false;
      cameraStreamError.value = e;
    });

  const tick = () => {
    if (!isMounted.value) return;
    if (currentDevice.value !== selectedDevice.value.value) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      throttledSendMessage(imageData);
    }
    requestAnimationFrame(tick);
  };
};
</script>

<template>
  <div class="scanner-container">
    <canvas v-if="isMediaStreamAPISupported" id="canvas" />
    <p v-else>Media stream API is not supported.</p>
    <p v-if="!isCameraAllowed">
      No access to camera.<br />{{ cameraStreamError }}
    </p>

    <div v-if="devices.length > 1" class="scanner-control">
      <va-select
        v-model="selectedDevice"
        :options="devices"
        placeholder="Select videoInput device"
      />
    </div>
  </div>
</template>

<style scoped>
.scanner-container {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}
.scanner-container canvas {
  max-width: 100%;
  max-height: 100%;
}
.scanner-control {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}
video {
  max-width: 100%;
  max-height: 100%;
}
</style>
