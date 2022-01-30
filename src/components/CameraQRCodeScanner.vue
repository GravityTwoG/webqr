<template>
  <div class="scanner-container">
    <canvas v-if="isMediaStreamAPISupported" id="canvas" />
    <p v-else>Media stream API is not supported.</p>
    <p v-if="!isCameraAllowed">
      No access to camera.<br />{{ cameraStreamError }}
    </p>
  </div>
</template>

<style scoped>
video {
  max-width: 100%;
  max-height: 100%;
}
.scanner-container {
  position: relative;
}
</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { throttle } from '@/utilities';

import {
  createWorker,
  destroyWorker,
  registerMessageListener,
  sendMessage,
} from '../qr-recognition.worker-api';

const isMediaStreamAPISupported = () => {
  return (
    navigator &&
    navigator.mediaDevices &&
    'enumerateDevices' in navigator.mediaDevices &&
    'getUserMedia' in navigator.mediaDevices
  );
};

const getCameraStream = (facingMode = 'environment') => {
  // Use facingMode: environment to attemt to get the front camera on phones
  return navigator.mediaDevices.getUserMedia({ video: { facingMode } });
};

@Options({
  name: 'camera-qrcode-reader',
  emits: ['decode', 'error'],
  data() {
    return {
      isMounted: false,
      isMediaStreamAPISupported: isMediaStreamAPISupported(),
      isCameraAllowed: true,
      cameraStreamError: '',
    };
  },

  mounted() {
    this.isMounted = true;

    if (!this.isMediaStreamAPISupported) {
      return;
    }

    createWorker();
    this.throttledSendMessage = throttle(sendMessage, 200);

    const canvasElement = document.getElementById(
      'canvas'
    ) as HTMLCanvasElement;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    const video = document.createElement('video');

    getCameraStream()
      .then((stream) => {
        const streamTrack = stream.getTracks()[0];
        this.stopCamera = streamTrack.stop.bind(streamTrack);
        this.isCameraAllowed = true;

        video.srcObject = stream;
        video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
      })
      .catch((e) => {
        console.log('Error on getCameraStream: ', e);
        this.isCameraAllowed = false;
        this.cameraStreamError = e;
      });

    registerMessageListener((code) => {
      if (code) {
        this.$emit('decode', code.data);
      } else {
        this.$emit('error', 'not found');
      }
    });

    const tick = () => {
      if (!this.isMounted) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = ctx.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        this.throttledSendMessage(imageData);
      }
      requestAnimationFrame(tick);
    };
  },
  beforeUnmount() {
    this.isMounted = false;
    if (this.stopCamera) this.stopCamera();
    destroyWorker();
  },
  methods: {},
})
export default class QRCodeScanner extends Vue {}
</script>
